import { html } from "../../../../infra/html";
import "./nav.css";
import { State, Emit } from "../../../../domain/models/state";
import NavMenu from "../nav-menu/nav-menu";
import {
    ADD_FILM_MENU,
    COLLECTION_MANAGEMENT_MENU,
    CREATE_COLLECTION_MENU,
    FILM_MANAGEMENT_MENU,
    LIST_FILMS_MENU,
    LOAD_COLLECTION_MENU,
} from "../../../../infra/constants";
import { items } from "./nav-menu-items";
import { collectionSelector } from "../../../../infra/selectors/collection";

export default (state: State, emit: Emit): HTMLElement => {
    const collection = collectionSelector(state);
    const menus: NavMenu[] = [];

    const collectionManagementMenu = new NavMenu(
        "Collection Management",
        COLLECTION_MANAGEMENT_MENU,
    );
    collectionManagementMenu.addMenuItem(items[CREATE_COLLECTION_MENU]);
    collectionManagementMenu.addMenuItem(items[LOAD_COLLECTION_MENU]);
    menus.push(collectionManagementMenu);

    if (collection != null) {
        const filmManagementMenu = new NavMenu(
            "Film Management",
            FILM_MANAGEMENT_MENU,
        );
        filmManagementMenu.addMenuItem(items[LIST_FILMS_MENU]);
        filmManagementMenu.addMenuItem(items[ADD_FILM_MENU]);
        menus.push(filmManagementMenu);
    }

    return html`
        <nav id="main-nav">
            <ul>${menus.map((menu: NavMenu) => menu.render(state, emit))}</ul>
        </nav>
    `;
};
