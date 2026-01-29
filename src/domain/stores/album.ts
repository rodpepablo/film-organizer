import Nanobus from "nanobus";
import {
    ALBUM_CREATION_SUCCESS,
    ALBUM_LOAD_ERROR,
    ALBUM_LOAD_SUCCESS,
    CREATE_ALBUM_FORM,
} from "../../infra/constants";
import {
    CLEAR_FORM,
    CLOSE_MODAL,
    CREATE_ALBUM_REQUEST,
    CREATE_NOTIFICATION,
    FORM_ERROR,
    LOAD_ALBUM_REQUEST,
} from "../../infra/events";
import { EventParams, State } from "../models/state";
import { AlbumValidators } from "../validators/album";
import { ZAlbum } from "../models/album";

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
            } catch {
                this.emitter.emit(CREATE_NOTIFICATION, ALBUM_LOAD_ERROR);
            }
            this.emitter.emit("render");
        }
    };
}

export function albumStore(state: Substate, emitter: Nanobus) {
    const api =
        process.env.NODE_ENV !== "test" ? window.api : ({} as Window["api"]);
    const albumStoreManager = new AlbumStoreManager(state, emitter, api);

    emitter.on(CREATE_ALBUM_REQUEST, albumStoreManager.manageCreateAlbum);
    emitter.on(LOAD_ALBUM_REQUEST, albumStoreManager.manageLoadAlbum);
}
