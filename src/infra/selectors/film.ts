import { State } from "../../domain/models/state";
import { Film, FilmInfo } from "../../domain/models/film";

export const filmsSelector = (state: Pick<State, "album">): Film[] | null =>
    state.album !== null ? state.album.films : null;

export const filmDetailSelector = (
    state: Pick<State, "location" | "album">,
): Film | null =>
    state.album?.films?.find((film) => film.id === state.location[1]) || null;
export const filmInfoSelector = (
    state: Pick<State, "album" | "selectedFilm">,
): FilmInfo | null =>
    state.album?.films?.find((film) => film.id === state.selectedFilm)?.info ||
    null;
