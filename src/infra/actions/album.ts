import { SortFilmListParams } from "../../domain/stores/album";
import { Emit } from "../../domain/models/state";
import {
    CREATE_ALBUM_REQUEST,
    LOAD_ALBUM_REQUEST,
    SAVE_ALBUM_REQUEST,
    SORT_FILM_LIST,
} from "../events";

export const createAlbum = (emit: Emit) => emit(CREATE_ALBUM_REQUEST);
export const loadAlbum = (emit: Emit) => emit(LOAD_ALBUM_REQUEST);
export const saveAlbum = (emit: Emit) => emit(SAVE_ALBUM_REQUEST);
export const sortFilmList = (emit: Emit, params: SortFilmListParams) =>
    emit(SORT_FILM_LIST, params);
