import { Album } from "../../domain/models/album";
import { State } from "../../domain/models/state";

export const albumSelector = (state: Pick<State, "album">): Album | null =>
    state.album;

export const albumNameSelector = (state: Pick<State, "album">) =>
    state.album?.name || null;
