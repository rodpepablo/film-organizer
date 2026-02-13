import { openModal, navigate } from "../../../../infra/actions/ui";
import { loadAlbum } from "../../../../infra/actions/album";
import { addFilm } from "../../../../infra/actions/film";
import { Emit } from "../../../../domain/models/state";
import {
    ADD_FILM_MENU,
    CREATE_ALBUM_MENU,
    CREATE_ALBUM_MODAL,
    FILM_SECTION,
    LIST_FILMS_MENU,
    LOAD_ALBUM_MENU,
} from "../../../../infra/constants";
import NavMenuItem from "../nav-menu-item/nav-menu-item";

const createAlbum = new NavMenuItem("Create Album", (emit) => {
    openModal(emit, { modalId: CREATE_ALBUM_MODAL });
});

const loadAlbumMenu = new NavMenuItem("Load Album", (emit: Emit) => {
    loadAlbum(emit);
});

const listFilms = new NavMenuItem("Film List", (emit: Emit) => {
    navigate(emit, { to: [FILM_SECTION] });
});

const addFilmMenu = new NavMenuItem("Add Film Roll", (emit: Emit) => {
    addFilm(emit);
});

export const items: Record<string, NavMenuItem> = {
    [CREATE_ALBUM_MENU]: createAlbum,
    [LOAD_ALBUM_MENU]: loadAlbumMenu,
    [LIST_FILMS_MENU]: listFilms,
    [ADD_FILM_MENU]: addFilmMenu,
};
