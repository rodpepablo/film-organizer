import { Emit } from "../../../domain/models/state";
import { SortImageListParams } from "../../stores/types";
import {
    ADD_FILM_REQUEST,
    EDIT_FILM_NAME_REQUEST,
    SORT_IMAGE_LIST,
} from "../../../infra/events";

export const addFilm = (emit: Emit) => emit(ADD_FILM_REQUEST);
export const editFilmName = (emit: Emit) => emit(EDIT_FILM_NAME_REQUEST);
export const sortImageList = (emit: Emit, params: SortImageListParams) =>
    emit(SORT_IMAGE_LIST, params);
