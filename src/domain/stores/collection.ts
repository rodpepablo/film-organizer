import Nanobus from "nanobus";
import {
    COLLECTION_CREATION_SUCCESS,
    COLLECTION_LOAD_ERROR,
    COLLECTION_LOAD_SUCCESS,
    COLLECTION_SAVE_SUCCESS,
    CREATE_COLLECTION_FORM,
    FILM_SECTION,
    UNEXPECTED_ERROR,
} from "../../infra/constants";
import {
    CREATE_COLLECTION_REQUEST,
    LOAD_COLLECTION_REQUEST,
    SAVE_COLLECTION_REQUEST,
    SORT_FILM_LIST,
} from "../../infra/events";
import { Emit, State } from "../models/state";
import { CollectionValidators } from "../validators/collection";
import { IPCError, IPCErrors } from "../../infra/ipc-service";
import { uiFormValuesSelector } from "../../infra/selectors/ui";
import {
    clearFormError,
    closeModal,
    createNotification,
    clearForm,
    navigate,
    formError,
} from "../../infra/actions/ui";

export type CreateCollectionValues = {
    name: string;
};

export type SortFilmListParams = {
    newOrder: string[];
};

type Substate = Pick<State, "collection" | "forms">;

export class CollectionStoreManager {
    state: Substate;
    emit: Emit;
    api: Window["api"];

    constructor(state: Substate, emitter: Nanobus, api: Window["api"]) {
        this.state = state;
        this.emit = emitter.emit.bind(emitter);
        this.api = api;
    }

    manageCreateCollection = async (): Promise<void> => {
        clearFormError(this.emit, { formId: CREATE_COLLECTION_FORM });
        const formValues = uiFormValuesSelector(
            this.state,
            CREATE_COLLECTION_FORM,
        ) as CreateCollectionValues;
        const [isValid, error] =
            CollectionValidators.collectionCreation.validate(formValues);

        if (isValid) {
            const path = await this.api.fs.getFolder();
            if (path !== null) {
                const collection = await this.api.collection.createCollection(
                    path,
                    formValues.name,
                );

                this.state.collection = collection;
                closeModal(this.emit);
                createNotification(this.emit, COLLECTION_CREATION_SUCCESS);
                clearForm(this.emit, { formId: CREATE_COLLECTION_FORM });
                navigate(this.emit, { to: [FILM_SECTION] });
            }
        } else {
            formError(this.emit, {
                formId: CREATE_COLLECTION_FORM,
                error: error.msg,
            });
        }
        this.emit("render");
    };

    manageLoadCollection = async (): Promise<void> => {
        const path = await this.api.fs.getFile();
        if (path !== null) {
            const result = await this.api.collection.loadCollection(path);

            if (result.ok) {
                this.state.collection = result.result;
                createNotification(this.emit, COLLECTION_LOAD_SUCCESS);
                navigate(this.emit, { to: [FILM_SECTION] });
            } else {
                createNotification(this.emit, COLLECTION_LOAD_ERROR);
            }
            this.emit("render");
        }
    };

    manageSaveCollection = async (): Promise<void> => {
        try {
            this.state.collection = await this.api.collection.saveCollection(
                this.state.collection,
            );
            createNotification(this.emit, COLLECTION_SAVE_SUCCESS);
            this.emit("render");
        } catch (error) {
            this.manageErrors({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
                message: error,
            });
        }
    };

    manageSortFilmList = (params: SortFilmListParams) => {
        const indexedFilms = Object.fromEntries(
            this.state.collection.films.map((film) => [film.id, film]),
        );
        this.state.collection.films = params.newOrder.map((id) => indexedFilms[id]);
        this.emit("render");
    };

    manageErrors(error: IPCError) {
        if (process.env.NODE_ENV !== "test") console.log(error);
        createNotification(this.emit, UNEXPECTED_ERROR);
    }
}

export function collectionStore(state: Substate, emitter: Nanobus) {
    const api =
        process.env.NODE_ENV !== "test" ? window.api : ({} as Window["api"]);
    const collectionStoreManager = new CollectionStoreManager(
        state,
        emitter,
        api,
    );

    emitter.on(
        CREATE_COLLECTION_REQUEST,
        collectionStoreManager.manageCreateCollection,
    );
    emitter.on(
        LOAD_COLLECTION_REQUEST,
        collectionStoreManager.manageLoadCollection,
    );
    emitter.on(
        SAVE_COLLECTION_REQUEST,
        collectionStoreManager.manageSaveCollection,
    );
    emitter.on(SORT_FILM_LIST, collectionStoreManager.manageSortFilmList);
}
