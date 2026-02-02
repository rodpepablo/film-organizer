import Nanobus from "nanobus";
import { IPCError, IPCErrors } from "../../infra/ipc-service";
import {
    FILM_ADDITION_SUCCESS,
    FILM_NOT_IN_ALBUM_ERROR,
    UNEXPECTED_ERROR,
} from "../../infra/constants";
import { ADD_FILM_REQUEST, CREATE_NOTIFICATION } from "../../infra/events";
import { State } from "../models/state";

type Substate = Pick<State, "album">;

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
}
