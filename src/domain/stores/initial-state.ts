import {
    ALBUM_MANAGEMENT_MENU,
    FILM_MANAGEMENT_MENU,
} from "../../infra/constants";
import { State } from "../models/state";

export default function createInitialState(state: State): void {
    state.menus = {
        [ALBUM_MANAGEMENT_MENU]: false,
        [FILM_MANAGEMENT_MENU]: false,
    };
    state.modal = {
        active: false,
        modalId: null,
    };
    state.album = null;
}
