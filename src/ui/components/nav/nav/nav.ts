import { html } from "../../../../infra/html";
import "./nav.css";
import { State, Emit } from "../../../../domain/models/state";
import NavMenu from "../nav-menu/nav-menu";
import {
    ADD_FILM_MENU,
    ALBUM_MANAGEMENT_MENU,
    CREATE_ALBUM_MENU,
    FILM_MANAGEMENT_MENU,
    LOAD_ALBUM_MENU,
} from "../../../../infra/constants";
import { items } from "./nav-menu-items";
import { albumSelector } from "../../../../infra/selectors/album";

export default (state: State, emit: Emit): HTMLElement => {
    const album = albumSelector(state);
    const menus: NavMenu[] = [];

    const albumManagementMenu = new NavMenu(
        "Album Management",
        ALBUM_MANAGEMENT_MENU,
    );
    albumManagementMenu.addMenuItem(items[CREATE_ALBUM_MENU]);
    albumManagementMenu.addMenuItem(items[LOAD_ALBUM_MENU]);
    menus.push(albumManagementMenu);

    if (album != null) {
        const filmManagementMenu = new NavMenu(
            "Film Management",
            FILM_MANAGEMENT_MENU,
        );
        filmManagementMenu.addMenuItem(items[ADD_FILM_MENU]);
        menus.push(filmManagementMenu);
    }

    return html`
        <nav id="main-nav">
            <ul>${menus.map((menu: NavMenu) => menu.render(state, emit))}</ul>
        </nav>
    `;
};
