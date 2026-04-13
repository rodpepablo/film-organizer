import { Emit } from "../../../domain/models/state";
import {
    CreateNotificationParams,
    DeleteNotificationParams,
    FormErrorParams,
    FormEventParams,
    FormUpdateParams,
    NavigateParams,
    OpenModalParams,
    ShowFilmInfoParams,
    ToggleNavMenuParams,
} from "../../stores/types";
import {
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    DELETE_NOTIFICATION,
    FORM_ERROR,
    NAVIGATE,
    OPEN_MODAL,
    TOGGLE_NAV_MENU,
    UPDATE_FORM,
    SHOW_FILM_INFO,
} from "../../../infra/events";

export const navigate = (emit: Emit, params: NavigateParams) =>
    emit(NAVIGATE, params);
export const toggleNavMenu = (emit: Emit, params: ToggleNavMenuParams) =>
    emit(TOGGLE_NAV_MENU, params);
export const openModal = (emit: Emit, params: OpenModalParams) =>
    emit(OPEN_MODAL, params);
export const closeModal = (emit: Emit) => emit(CLOSE_MODAL);
export const formError = (emit: Emit, params: FormErrorParams) =>
    emit(FORM_ERROR, params);
export const updateForm = (emit: Emit, params: FormUpdateParams) =>
    emit(UPDATE_FORM, params);
export const clearFormError = (emit: Emit, params: FormEventParams) =>
    emit(CLEAR_FORM_ERROR, params);
export const clearForm = (emit: Emit, params: FormEventParams) =>
    emit(CLEAR_FORM, params);
export const createNotification = (
    emit: Emit,
    params: CreateNotificationParams,
) => emit(CREATE_NOTIFICATION, params);
export const deleteNotification = (
    emit: Emit,
    params: DeleteNotificationParams,
) => emit(DELETE_NOTIFICATION, params);
export const showFilmInfo = (emit: Emit, params: ShowFilmInfoParams) =>
    emit(SHOW_FILM_INFO, params);
