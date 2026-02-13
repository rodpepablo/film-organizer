import { Emit } from "../../domain/models/state";
import { ADD_FILM_REQUEST, EDIT_FILM_NAME_REQUEST } from "../events";

export const addFilm = (emit: Emit) => emit(ADD_FILM_REQUEST);
export const editFilmName = (emit: Emit) => emit(EDIT_FILM_NAME_REQUEST);
