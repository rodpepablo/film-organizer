import { CREATE_ALBUM_MODAL } from "../../../../infra/constants";
import { OPEN_MODAL } from "../../../../infra/events";
import NavMenuItem from "../nav-menu-item/nav-menu-item";

const createAlbum = new NavMenuItem("Create Album", (emit) => {
    emit(OPEN_MODAL, { modalId: CREATE_ALBUM_MODAL });
});

export const items = {
    [CREATE_ALBUM_MODAL]: createAlbum,
};
