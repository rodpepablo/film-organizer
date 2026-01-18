import { State } from "../../domain/models/state";

export const albumNameSelector = (state: Pick<State, "album">) =>
    state.album?.name || null;
