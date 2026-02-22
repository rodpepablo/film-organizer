import { Emit } from "../../domain/models/state";
import { CreateImagePreviewParams } from "../../domain/stores/film-image";
import {
    CREATE_IMAGE_PREVIEW_REQUEST,
    EDIT_IMAGE_NAME_REQUEST,
} from "../events";

export const editImageNameRequest = (emit: Emit) =>
    emit(EDIT_IMAGE_NAME_REQUEST);
export const createImagePreviewRequest = (
    emit: Emit,
    params: CreateImagePreviewParams,
) => emit(CREATE_IMAGE_PREVIEW_REQUEST, params);
