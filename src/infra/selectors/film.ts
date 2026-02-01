import { State } from "../../domain/models/state";
import { Film } from "../../domain/models/film";

export const filmsSelector = (state: Pick<State, "album">): Film[] | null =>
    state.album !== null ? state.album.films : null;
