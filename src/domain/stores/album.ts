import Nanobus from "nanobus";
import {
    ALBUM_CREATION_SUCCESS,
    ALBUM_LOAD_ERROR,
    ALBUM_LOAD_SUCCESS,
    ALBUM_SAVE_SUCCESS,
    CREATE_ALBUM_FORM,
    FILM_SECTION,
    UNEXPECTED_ERROR,
} from "../../infra/constants";
import {
    CREATE_ALBUM_REQUEST,
    LOAD_ALBUM_REQUEST,
    SAVE_ALBUM_REQUEST,
} from "../../infra/events";
import { Emit, State } from "../models/state";
import { AlbumValidators } from "../validators/album";
import { ZAlbum } from "../models/album";
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

export type CreateAlbumValues = {
    name: string;
};

type Substate = Pick<State, "album" | "forms">;

export class AlbumStoreManager {
    state: Substate;
    emit: Emit;
    api: Window["api"];

    constructor(state: Substate, emitter: Nanobus, api: Window["api"]) {
        this.state = state;
        this.emit = emitter.emit.bind(emitter);
        this.api = api;
    }

    manageCreateAlbum = async (): Promise<void> => {
        clearFormError(this.emit, { formId: CREATE_ALBUM_FORM });
        const formValues = uiFormValuesSelector(
            this.state,
            CREATE_ALBUM_FORM,
        ) as CreateAlbumValues;
        const [isValid, error] = AlbumValidators.albumCreation.validate(formValues);

        if (isValid) {
            const path = await this.api.fs.getFolder();
            if (path !== null) {
                const album = await this.api.album.createAlbum(path, formValues.name);

                this.state.album = album;
                closeModal(this.emit);
                createNotification(this.emit, ALBUM_CREATION_SUCCESS);
                clearForm(this.emit, { formId: CREATE_ALBUM_FORM });
                navigate(this.emit, { to: [FILM_SECTION] });
            }
        } else {
            formError(this.emit, {
                formId: CREATE_ALBUM_FORM,
                error: error.msg,
            });
        }
        this.emit("render");
    };

    manageLoadAlbum = async (): Promise<void> => {
        const path = await this.api.fs.getFile();
        if (path !== null) {
            const album = await this.api.album.loadAlbum(path);

            try {
                ZAlbum.parse(album);
                this.state.album = album;
                createNotification(this.emit, ALBUM_LOAD_SUCCESS);
                navigate(this.emit, { to: [FILM_SECTION] });
            } catch {
                createNotification(this.emit, ALBUM_LOAD_ERROR);
            }
            this.emit("render");
        }
    };

    manageSaveAlbum = async (): Promise<void> => {
        try {
            await this.api.album.saveAlbum(this.state.album);
            createNotification(this.emit, ALBUM_SAVE_SUCCESS);
        } catch (error) {
            this.manageErrors({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
                message: error,
            });
        }
    };

    manageErrors(error: IPCError) {
        if (process.env.NODE_ENV !== "test") console.log(error);
        createNotification(this.emit, UNEXPECTED_ERROR);
    }
}

export function albumStore(state: Substate, emitter: Nanobus) {
    const api =
        process.env.NODE_ENV !== "test" ? window.api : ({} as Window["api"]);
    const albumStoreManager = new AlbumStoreManager(state, emitter, api);

    emitter.on(CREATE_ALBUM_REQUEST, albumStoreManager.manageCreateAlbum);
    emitter.on(LOAD_ALBUM_REQUEST, albumStoreManager.manageLoadAlbum);
    emitter.on(SAVE_ALBUM_REQUEST, albumStoreManager.manageSaveAlbum);
}
