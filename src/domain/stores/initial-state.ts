import {
    COLLECTION_MANAGEMENT_MENU,
    FILM_MANAGEMENT_MENU,
    HOME_SECTION,
} from "../../infra/constants";
import { State } from "../models/state";

export default function createInitialState(state: State): void {
    state.location = [HOME_SECTION];
    state.menus = {
        [COLLECTION_MANAGEMENT_MENU]: true,
        [FILM_MANAGEMENT_MENU]: true,
    };
    state.modal = {
        active: false,
        modalId: null,
    };
    state.forms = {};
    state.notifications = [];
    state.collection = null;
}
