import { html } from "../../../../infra/html";
import "./nav.css";
import { State, Emit } from "../../../../domain/models/state";
import NavMenu from "../nav-menu/nav-menu";
import {
    ALBUM_MANAGEMENT_MENU,
    CREATE_ALBUM_MENU,
    FILM_MANAGEMENT_MENU,
    LOAD_ALBUM_MENU,
} from "../../../../infra/constants";
import { items } from "./nav-menu-items";

export default (state: State, emit: Emit): HTMLElement => {
    const albumManagementMenu = new NavMenu(
        "Album Management",
        ALBUM_MANAGEMENT_MENU,
    );
    albumManagementMenu.addMenuItem(items[CREATE_ALBUM_MENU]);
    albumManagementMenu.addMenuItem(items[LOAD_ALBUM_MENU]);

    const filmManagementMenu = new NavMenu(
        "Film Management",
        FILM_MANAGEMENT_MENU,
    );

    const menus: NavMenu[] = [];
    menus.push(albumManagementMenu);
    menus.push(filmManagementMenu);

    return html`
        <nav id="main-nav">
            <ul>${menus.map((menu: NavMenu) => menu.render(state, emit))}</ul>
        </nav>
    `;
};
