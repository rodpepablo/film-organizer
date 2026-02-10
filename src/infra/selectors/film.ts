import { State } from "../../domain/models/state";
import { Film } from "../../domain/models/film";

export const filmsSelector = (state: Pick<State, "album">): Film[] | null =>
    state.album !== null ? state.album.films : null;

export const filmDetailSelector = (
    state: Pick<State, "location" | "album">,
): Film | null =>
    state.album?.films?.find((film) => film.id === state.location[1]) || null;
