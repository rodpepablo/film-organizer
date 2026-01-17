import { html } from "../../../../infra/html";
import "./nav.css";
import { State, Emit } from "../../../../domain/models/state";
import NavMenu from "../nav-menu/nav-menu";
import NavMenuItem from "../nav-menu-item/nav-menu-item";
import {
    ALBUM_MANAGEMENT_MENU,
    FILM_MANAGEMENT_MENU,
} from "../../../../infra/constants";

export default (state: State, emit: Emit) => {
    const albumManagementMenu = new NavMenu(
        "Album Management",
        ALBUM_MANAGEMENT_MENU,
    );
    albumManagementMenu.addMenuItem(new NavMenuItem("Create album"));
    albumManagementMenu.addMenuItem(new NavMenuItem("Load album"));

    const filmManagementMenu = new NavMenu(
        "Film Management",
        FILM_MANAGEMENT_MENU,
    );
    filmManagementMenu.addMenuItem(new NavMenuItem("Load film"));

    const menus: NavMenu[] = [];
    menus.push(albumManagementMenu);
    menus.push(filmManagementMenu);

    return html`
        <nav id="main-nav">
            <ul>${menus.map((menu: NavMenu) => menu.render(state, emit))}</ul>
        </nav>
    `;
};
