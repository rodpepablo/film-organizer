import Nanobus from "nanobus";
import { CREATE_ALBUM_FORM } from "../../infra/constants";
import {
    CLEAR_FORM,
    CLOSE_MODAL,
    CREATE_ALBUM_REQUEST,
    FORM_ERROR,
} from "../../infra/events";
import { EventParams, State } from "../models/state";
import { AlbumValidators } from "../validators/album";

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
            const album = { name: params.name };
            const path = await this.api.album.getFolder();
            await this.api.album.saveAlbum(path, album);
            this.state.album = album;
            this.emitter.emit(CLOSE_MODAL);
        } else {
            this.emitter.emit(FORM_ERROR, {
                form: CREATE_ALBUM_FORM,
                error: error.msg,
            });
        }
        this.emitter.emit("render");
    };
}

export function albumStore(state: Substate, emitter: Nanobus) {
    const albumStoreManager = new AlbumStoreManager(state, emitter, window.api);

    emitter.on(CREATE_ALBUM_REQUEST, albumStoreManager.manageCreateAlbum);
}
