import { html } from "../../../../infra/html";
import "./nav-menu.css";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import NavMenuItem from "../nav-menu-item/nav-menu-item";
import { TOGGLE_NAV_MENU } from "../../../../infra/events";
import { uiMenuStateSelector } from "../../../../infra/selectors/ui";

export default class NavMenu implements Component {
    title: string;
    id: string;
    open: boolean;
    menuItems: NavMenuItem[];

    constructor(title: string, id: string) {
        this.title = title;
        this.id = id;
        this.open = false;
        this.menuItems = [];
    }

    addMenuItem(menuItem: NavMenuItem) {
        this.menuItems.push(menuItem);
    }

    toggle(emit: Emit) {
        return (e: DOMEvent) => {
            e.preventDefault();
            e.stopPropagation();
            emit(TOGGLE_NAV_MENU, {
                menu: this.id,
            });
        };
    }

    render(state: Pick<State, "menus">, emit: Emit): HTMLElement {
        this.open = uiMenuStateSelector(this.id, state);

        return html`
            <div class="nav-menu">
                <li class="nav-menu-title" onclick=${this.toggle(emit)}>${this.title}</li>
                <div class="nav-menu-elements" hidden=${!this.open}>
                    ${this.menuItems.map((menuItem) => menuItem.render(state as State, emit))}
                </div>
            </div>
        `;
    }
}
