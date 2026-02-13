import Nanobus from "nanobus";
import { IPCError, IPCErrors } from "../../infra/ipc-service";
import {
    EDIT_FILM_NAME_FORM,
    FILM_ADDITION_SUCCESS,
    FILM_NAME_EDIT_SUCCESS,
    FILM_NOT_IN_ALBUM_ERROR,
    UNEXPECTED_ERROR,
} from "../../infra/constants";
import {
    ADD_FILM_REQUEST,
    EDIT_FILM_NAME_REQUEST,
    SORT_IMAGE_LIST,
} from "../../infra/events";
import { Emit, State } from "../models/state";
import { uiFormValuesSelector } from "../../infra/selectors/ui";
import { FilmValidators } from "../validators/film";
import {
    createNotification,
    clearFormError,
    clearForm,
    closeModal,
    formError,
} from "../../infra/actions/ui";
import { FilmImage } from "../models/film";

type Substate = Pick<State, "album">;

type EditFilmNameParams = {
    filmId: string;
    name: string;
};

export type SortImageListParams = {
    filmId: string;
    newOrder: string[];
};

export class FilmStoreManager {
    state: Substate;
    emit: Emit;
    api: Window["api"];

    constructor(state: Substate, emitter: Nanobus, api: Window["api"]) {
        this.state = state;
        this.emit = emitter.emit.bind(emitter);
        this.api = api;
    }

    manageAddFilm = async (): Promise<void> => {
        try {
            const albumPath = this.state.album.path;
            const filmPath = await this.api.fs.getFolder();
            if (filmPath !== null) {
                const filmResult = await this.api.film.addFilm(albumPath, filmPath);
                if (filmResult.ok) {
                    this.state.album.films.push(filmResult.result);
                    createNotification(this.emit, FILM_ADDITION_SUCCESS);
                    this.emit("render");
                    return;
                }
                this.manageErrors(filmResult as IPCError);
            }
        } catch (error) {
            this.manageErrors({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
                message: error,
            });
        }
    };

    editFilmName = () => {
        clearFormError(this.emit, { formId: EDIT_FILM_NAME_FORM });

        const formValues: EditFilmNameParams = uiFormValuesSelector(
            this.state as State,
            EDIT_FILM_NAME_FORM,
        );
        const [is_valid, error] = FilmValidators.filmNameEdit.validate(formValues);

        if (is_valid) {
            try {
                const film = this.state.album.films.find(
                    (film) => film.id === formValues.filmId,
                );
                film.name = formValues.name;
                createNotification(this.emit, FILM_NAME_EDIT_SUCCESS);
            } catch (error) {
                this.manageErrors({
                    ok: false,
                    type: IPCErrors.UNEXPECTED_ERROR,
                    message: error,
                });
            } finally {
                closeModal(this.emit);
                clearForm(this.emit, { formId: EDIT_FILM_NAME_FORM });
                this.emit("render");
            }
        } else {
            formError(this.emit, { formId: EDIT_FILM_NAME_FORM, error: error.msg });
            this.emit("render");
        }
    };

    sortImageList = (params: SortImageListParams) => {
        try {
            const film = this.state.album.films.find(
                (film) => film.id === params.filmId,
            );
            const indexedImages = Object.fromEntries(
                film.images.map((image) => [image.id, image]),
            );
            film.images = params.newOrder.map((id) => indexedImages[id]);
        } catch (error) {
            this.manageErrors({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
                message: error,
            });
        }
        this.emit("render");
    };

    manageErrors(error: IPCError) {
        if (process.env.NODE_ENV !== "test") console.log(error);
        if (error.type === IPCErrors.FILM_FOLDER_OUTSIDE_ALBUM_FOLDER) {
            createNotification(this.emit, FILM_NOT_IN_ALBUM_ERROR);
            this.emit("render");
        } else {
            createNotification(this.emit, UNEXPECTED_ERROR);
            this.emit("render");
        }
    }
}

export function filmStore(state: Substate, emitter: Nanobus) {
    const api =
        process.env.NODE_ENV !== "test" ? window.api : ({} as Window["api"]);
    const filmStoreManager = new FilmStoreManager(state, emitter, api);

    emitter.on(ADD_FILM_REQUEST, filmStoreManager.manageAddFilm);
    emitter.on(EDIT_FILM_NAME_REQUEST, filmStoreManager.editFilmName);
    emitter.on(SORT_IMAGE_LIST, filmStoreManager.sortImageList);
}
