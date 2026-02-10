import {
    ALBUM_MANAGEMENT_MENU,
    FILM_MANAGEMENT_MENU,
    HOME_SECTION,
} from "../../infra/constants";
import { State } from "../models/state";

export default function createInitialState(state: State): void {
    state.location = [HOME_SECTION];
    state.menus = {
        [ALBUM_MANAGEMENT_MENU]: false,
        [FILM_MANAGEMENT_MENU]: false,
    };
    state.modal = {
        active: false,
        modalId: null,
    };
    state.forms = {};
    state.notifications = [];
    state.album = null;
}
