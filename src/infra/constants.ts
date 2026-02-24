import { CreateNotificationParams } from "../domain/stores/ui";

// NAVIGATION
export const HOME_SECTION = "home";
export const FILM_SECTION = "films";
export const FILM_DETAIL_SECTION = "film";

// MENUS
export const COLLECTION_MANAGEMENT_MENU = "collection-menu";
export const FILM_MANAGEMENT_MENU = "film-management-menu";

export const CREATE_COLLECTION_MENU = "create-collection-menu";
export const LOAD_COLLECTION_MENU = "load-collection-menu";
export const LIST_FILMS_MENU = "list-films-menu";
export const ADD_FILM_MENU = "add-film-menu";

// MODALS
export const CREATE_COLLECTION_MODAL = "create-collection-modal";
export const EDIT_FILM_NAME_MODAL = "edit-film-name-modal";
export const EDIT_IMAGE_NAME_MODAL = "edit-image-name-modal";
export const FILM_INFO_MODAL = "film-info-modal";
export const EDIT_FILM_INFO_MODAL = "edit-film-info-modal";

// FORMS
export const CREATE_COLLECTION_FORM = "create-collection-form";
export const EDIT_FILM_NAME_FORM = "edit-film-name-form";
export const EDIT_IMAGE_NAME_FORM = "edit-image-name-form";
export const EDIT_FILM_INFO_FORM = "edit-film-info-form";

// NOTIFICATIONS
const success = (message: string): CreateNotificationParams => ({
    type: "success",
    message,
});
const error = (message: string): CreateNotificationParams => ({
    type: "error",
    message,
});

export const COLLECTION_CREATION_SUCCESS = success("Collection created successfully");
export const COLLECTION_LOAD_SUCCESS = success("Collection loaded successfully");
export const COLLECTION_LOAD_ERROR = error("Trying to load invalid file");
export const COLLECTION_SAVE_SUCCESS = success("Collection saved successfully");

export const FILM_ADDITION_SUCCESS = success("Film added successfully");
export const FILM_NOT_IN_COLLECTION_ERROR = error(
    "Film has to be located in the same path or deeper than the collection file",
);
export const FILM_NAME_EDIT_SUCCESS = success("Film name changed successfully");
export const EDIT_FILM_INFO_SUCCESS = success("Film info changed successfully");

export const IMAGE_NAME_EDIT_SUCCESS = success(
    "Image name changed successfully",
);

export const UNEXPECTED_ERROR = error("Unexpected error");
