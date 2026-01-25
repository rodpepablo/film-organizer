import { Emit } from "../../../../domain/models/state";
import {
    CREATE_ALBUM_MENU,
    CREATE_ALBUM_MODAL,
    LOAD_ALBUM_MENU,
} from "../../../../infra/constants";
import { OPEN_MODAL, LOAD_ALBUM_REQUEST } from "../../../../infra/events";
import NavMenuItem from "../nav-menu-item/nav-menu-item";

const createAlbum = new NavMenuItem("Create Album", (emit) => {
    emit(OPEN_MODAL, { modalId: CREATE_ALBUM_MODAL });
});

const loadAlbum = new NavMenuItem("Load Album", (emit: Emit) => {
    emit(LOAD_ALBUM_REQUEST);
});

export const items = {
    [CREATE_ALBUM_MENU]: createAlbum,
    [LOAD_ALBUM_MENU]: loadAlbum,
};
