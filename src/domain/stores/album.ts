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

export function albumStore(state: Pick<State, "album">, emitter: Nanobus) {
    emitter.on(CREATE_ALBUM_REQUEST, (params: CreateAlbumParams) => {
        emitter.emit(CLEAR_FORM, { form: CREATE_ALBUM_FORM });
        const [isValid, error] = AlbumValidators.albumCreation.validate(params);
        if (isValid) {
            state.album = { name: params.name };
            emitter.emit(CLOSE_MODAL);
        } else {
            emitter.emit(FORM_ERROR, { form: CREATE_ALBUM_FORM, error: error.msg });
        }
        emitter.emit("render");
    });
}
