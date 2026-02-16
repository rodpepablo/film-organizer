import { Emit } from "../../domain/models/state";
import { EDIT_IMAGE_NAME_REQUEST } from "../events";

export const editImageNameRequest = (emit: Emit) =>
    emit(EDIT_IMAGE_NAME_REQUEST);
