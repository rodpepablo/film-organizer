import { CreateNotificationParams } from "../domain/stores/ui";

// NAVIGATION
export const HOME_SECTION = "home";
export const FILM_SECTION = "films";
export const FILM_DETAIL_SECTION = "film";

// MENUS
export const ALBUM_MANAGEMENT_MENU = "album-menu";
export const FILM_MANAGEMENT_MENU = "film-management-menu";

export const CREATE_ALBUM_MENU = "create-album-menu";
export const LOAD_ALBUM_MENU = "load-album-menu";
export const LIST_FILMS_MENU = "list-films-menu";
export const ADD_FILM_MENU = "add-film-menu";

// MODALS
export const CREATE_ALBUM_MODAL = "create-album-modal";
export const EDIT_FILM_NAME_MODAL = "edit-film-name-modal";

// FORMS
export const CREATE_ALBUM_FORM = "create-album-form";
export const EDIT_FILM_NAME_FORM = "edit-film-name-form";

// NOTIFICATIONS
const success = (message: string): CreateNotificationParams => ({
    type: "success",
    message,
});
const error = (message: string): CreateNotificationParams => ({
    type: "error",
    message,
});

export const ALBUM_CREATION_SUCCESS = success("Album created successfully");
export const ALBUM_LOAD_SUCCESS = success("Album loaded successfully");
export const ALBUM_LOAD_ERROR = error("Trying to load invalid file");
export const ALBUM_SAVE_SUCCESS = success("Album saved successfully");

export const FILM_ADDITION_SUCCESS = success("Film added successfully");
export const FILM_NOT_IN_ALBUM_ERROR = error(
    "Film has to be located in the same path or deeper than the album file",
);
export const FILM_NAME_EDIT_SUCCESS = success("Film name chaged successfully");

export const UNEXPECTED_ERROR = error("Unexpected error");
