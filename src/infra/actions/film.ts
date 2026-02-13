import { Emit } from "../../domain/models/state";
import {
    ADD_FILM_REQUEST,
    EDIT_FILM_NAME_REQUEST,
    SORT_IMAGE_LIST,
} from "../events";
import { SortImageListParams } from "../../domain/stores/film";

export const addFilm = (emit: Emit) => emit(ADD_FILM_REQUEST);
export const editFilmName = (emit: Emit) => emit(EDIT_FILM_NAME_REQUEST);
export const sortImageList = (emit: Emit, params: SortImageListParams) =>
    emit(SORT_IMAGE_LIST, params);
