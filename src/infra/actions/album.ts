import { Emit } from "../../domain/models/state";
import {
    CREATE_ALBUM_REQUEST,
    LOAD_ALBUM_REQUEST,
    SAVE_ALBUM_REQUEST,
} from "../events";

export const createAlbum = (emit: Emit) => emit(CREATE_ALBUM_REQUEST);
export const loadAlbum = (emit: Emit) => emit(LOAD_ALBUM_REQUEST);
export const saveAlbum = (emit: Emit) => emit(SAVE_ALBUM_REQUEST);
