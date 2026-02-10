import { Emit } from "../../../../domain/models/state";
import {
    ADD_FILM_MENU,
    CREATE_ALBUM_MENU,
    CREATE_ALBUM_MODAL,
    FILM_SECTION,
    LIST_FILMS_MENU,
    LOAD_ALBUM_MENU,
} from "../../../../infra/constants";
import {
    OPEN_MODAL,
    LOAD_ALBUM_REQUEST,
    ADD_FILM_REQUEST,
    NAVIGATE,
} from "../../../../infra/events";
import NavMenuItem from "../nav-menu-item/nav-menu-item";

const createAlbum = new NavMenuItem("Create Album", (emit) => {
    emit(OPEN_MODAL, { modalId: CREATE_ALBUM_MODAL });
});

const loadAlbum = new NavMenuItem("Load Album", (emit: Emit) => {
    emit(LOAD_ALBUM_REQUEST);
});

const listFilms = new NavMenuItem("Film List", (emit: Emit) => {
    emit(NAVIGATE, { to: [FILM_SECTION] });
});

const addFilm = new NavMenuItem("Add Film Roll", (emit: Emit) => {
    emit(ADD_FILM_REQUEST);
});

export const items: Record<string, NavMenuItem> = {
    [CREATE_ALBUM_MENU]: createAlbum,
    [LOAD_ALBUM_MENU]: loadAlbum,
    [LIST_FILMS_MENU]: listFilms,
    [ADD_FILM_MENU]: addFilm,
};
