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
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    EDIT_FILM_NAME_REQUEST,
    FORM_ERROR,
} from "../../infra/events";
import { State } from "../models/state";
import { uiFormValuesSelector } from "../../infra/selectors/ui";
import { FilmValidators } from "../validators/film";

type Substate = Pick<State, "album">;

type EditFilmNameParams = {
    filmId: string;
    name: string;
};

export class FilmStoreManager {
    state: Substate;
    emitter: Nanobus;
    api: Window["api"];

    constructor(state: Substate, emitter: Nanobus, api: Window["api"]) {
        this.state = state;
        this.emitter = emitter;
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
                    this.emitter.emit(CREATE_NOTIFICATION, FILM_ADDITION_SUCCESS);
                    this.emitter.emit("render");
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
        this.emitter.emit(CLEAR_FORM_ERROR, { formId: EDIT_FILM_NAME_FORM });
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
                this.emitter.emit(CREATE_NOTIFICATION, FILM_NAME_EDIT_SUCCESS);
            } catch (error) {
                this.manageErrors({ ok: false, type: IPCErrors.UNEXPECTED_ERROR });
            } finally {
                this.emitter.emit(CLOSE_MODAL);
                this.emitter.emit(CLEAR_FORM, { formId: EDIT_FILM_NAME_FORM });
                this.emitter.emit("render");
            }
        } else {
            this.emitter.emit(FORM_ERROR, { formId: EDIT_FILM_NAME_FORM, error });
            this.emitter.emit("render");
        }
    };

    manageErrors(error: IPCError) {
        if (process.env.NODE_ENV !== "test") console.log(error);
        if (error.type === IPCErrors.FILM_FOLDER_OUTSIDE_ALBUM_FOLDER) {
            this.emitter.emit(CREATE_NOTIFICATION, FILM_NOT_IN_ALBUM_ERROR);
            this.emitter.emit("render");
        } else {
            this.emitter.emit(CREATE_NOTIFICATION, UNEXPECTED_ERROR);
            this.emitter.emit("render");
        }
    }
}

export function filmStore(state: Substate, emitter: Nanobus) {
    const api =
        process.env.NODE_ENV !== "test" ? window.api : ({} as Window["api"]);
    const filmStoreManager = new FilmStoreManager(state, emitter, api);

    emitter.on(ADD_FILM_REQUEST, filmStoreManager.manageAddFilm);
    emitter.on(EDIT_FILM_NAME_REQUEST, filmStoreManager.editFilmName);
}
