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
    CLEAR_FORM,
    CLOSE_MODAL,
    CREATE_ALBUM_REQUEST,
    CREATE_NOTIFICATION,
    FORM_ERROR,
    LOAD_ALBUM_REQUEST,
    NAVIGATE,
    SAVE_ALBUM_REQUEST,
} from "../../infra/events";
import { EventParams, State } from "../models/state";
import { AlbumValidators } from "../validators/album";
import { ZAlbum } from "../models/album";
import { IPCError, IPCErrors } from "../../infra/ipc-service";

export type CreateAlbumParams = EventParams & {
    name: string;
};

type Substate = Pick<State, "album">;

export class AlbumStoreManager {
    state: Substate;
    emitter: Nanobus;
    api: Window["api"];

    constructor(state: Substate, emitter: Nanobus, api: Window["api"]) {
        this.state = state;
        this.emitter = emitter;
        this.api = api;
    }

    manageCreateAlbum = async (params: CreateAlbumParams): Promise<void> => {
        this.emitter.emit(CLEAR_FORM, { form: CREATE_ALBUM_FORM });
        const [isValid, error] = AlbumValidators.albumCreation.validate(params);

        if (isValid) {
            const path = await this.api.fs.getFolder();
            if (path === null) {
                this.emitter.emit(CLOSE_MODAL);
                this.emitter.emit("render");
                return;
            }

            const album = await this.api.album.createAlbum(path, params.name);

            this.state.album = album;
            this.emitter.emit(CLOSE_MODAL);
            this.emitter.emit(CREATE_NOTIFICATION, ALBUM_CREATION_SUCCESS);
            this.emitter.emit(NAVIGATE, { to: [FILM_SECTION] });
        } else {
            this.emitter.emit(FORM_ERROR, {
                form: CREATE_ALBUM_FORM,
                error: error.msg,
            });
        }
        this.emitter.emit("render");
    };

    manageLoadAlbum = async (): Promise<void> => {
        const path = await this.api.fs.getFile();
        if (path !== null) {
            const album = await this.api.album.loadAlbum(path);

            try {
                ZAlbum.parse(album);
                this.state.album = album;
                this.emitter.emit(CREATE_NOTIFICATION, ALBUM_LOAD_SUCCESS);
                this.emitter.emit(NAVIGATE, { to: [FILM_SECTION] });
            } catch {
                this.emitter.emit(CREATE_NOTIFICATION, ALBUM_LOAD_ERROR);
            }
            this.emitter.emit("render");
        }
    };

    manageSaveAlbum = async (): Promise<void> => {
        try {
            await this.api.album.saveAlbum(this.state.album);
            this.emitter.emit(CREATE_NOTIFICATION, ALBUM_SAVE_SUCCESS);
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
        this.emitter.emit(CREATE_NOTIFICATION, UNEXPECTED_ERROR);
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
