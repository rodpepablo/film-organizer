import Nanobus from "nanobus";
import { CLOSE_MODAL, CREATE_ALBUM_REQUEST } from "../../infra/events";
import { EventParams, State } from "../models/state";

export type CreateAlbumParams = EventParams & {
    name: string;
};

export function albumStore(state: Pick<State, "album">, emitter: Nanobus) {
    emitter.on(CREATE_ALBUM_REQUEST, (params: CreateAlbumParams) => {
        state.album = { name: params.name };
        emitter.emit(CLOSE_MODAL);
        emitter.emit("render");
    });
}
