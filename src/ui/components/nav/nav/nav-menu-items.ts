import { openModal, navigate } from "../../../../infra/actions/ui";
import { loadCollection } from "../../../../infra/actions/collection";
import { addFilm } from "../../../../infra/actions/film";
import { Emit } from "../../../../domain/models/state";
import {
    ADD_FILM_MENU,
    CREATE_COLLECTION_MENU,
    CREATE_COLLECTION_MODAL,
    FILM_SECTION,
    LIST_FILMS_MENU,
    LOAD_COLLECTION_MENU,
} from "../../../../infra/constants";
import NavMenuItem from "../nav-menu-item/nav-menu-item";

const createCollection = new NavMenuItem("Create Collection", (emit) => {
    openModal(emit, { modalId: CREATE_COLLECTION_MODAL });
});

const loadCollectionMenu = new NavMenuItem("Load Collection", (emit: Emit) => {
    loadCollection(emit);
});

const listFilms = new NavMenuItem("Film List", (emit: Emit) => {
    navigate(emit, { to: [FILM_SECTION] });
});

const addFilmMenu = new NavMenuItem("Add Film Roll", (emit: Emit) => {
    addFilm(emit);
});

export const items: Record<string, NavMenuItem> = {
    [CREATE_COLLECTION_MENU]: createCollection,
    [LOAD_COLLECTION_MENU]: loadCollectionMenu,
    [LIST_FILMS_MENU]: listFilms,
    [ADD_FILM_MENU]: addFilmMenu,
};
