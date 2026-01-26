import { CreateNotificationParams } from "../domain/stores/ui";

export const ALBUM_MANAGEMENT_MENU = "album-menu";
export const FILM_MANAGEMENT_MENU = "film-management-menu";

export const CREATE_ALBUM_MENU = "create-album-menu";
export const LOAD_ALBUM_MENU = "load-album-menu";

export const CREATE_ALBUM_MODAL = "create-album-modal";

// FORMS
export const CREATE_ALBUM_FORM = "create-album-form";

// NOTIFICATIONS
const success = (message: string): CreateNotificationParams => ({
    type: "success",
    message,
});
const error = (message: string): CreateNotificationParams => ({
    type: "error",
    message,
});
export const ALBUM_LOAD_SUCCESS = success("Album loaded successfully");
export const ALBUM_LOAD_ERROR = error("Trying to load invalid file");
