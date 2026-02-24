import { SortFilmListParams } from "../../domain/stores/collection";
import { Emit } from "../../domain/models/state";
import {
    CREATE_COLLECTION_REQUEST,
    LOAD_COLLECTION_REQUEST,
    SAVE_COLLECTION_REQUEST,
    SORT_FILM_LIST,
} from "../events";

export const createCollection = (emit: Emit) => emit(CREATE_COLLECTION_REQUEST);
export const loadCollection = (emit: Emit) => emit(LOAD_COLLECTION_REQUEST);
export const saveCollection = (emit: Emit) => emit(SAVE_COLLECTION_REQUEST);
export const sortFilmList = (emit: Emit, params: SortFilmListParams) =>
    emit(SORT_FILM_LIST, params);
