import { State } from "../../domain/models/state";
import { Film, FilmInfo } from "../../domain/models/film";

export const filmsSelector = (state: Pick<State, "collection">): Film[] | null =>
    state.collection !== null ? state.collection.films : null;

export const filmDetailSelector = (
    state: Pick<State, "location" | "collection">,
): Film | null =>
    state.collection?.films?.find((film) => film.id === state.location[1]) || null;
export const filmInfoSelector = (
    state: Pick<State, "collection" | "selectedFilm">,
): FilmInfo | null =>
    state.collection?.films?.find((film) => film.id === state.selectedFilm)?.info ||
    null;
