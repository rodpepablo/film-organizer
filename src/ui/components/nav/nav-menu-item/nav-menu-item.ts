import { html } from "../../../../infra/html";
import "./nav-menu-item.css";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";

export default class NavMenuItem implements Component {
    title: string;
    constructor(title: string) {
        this.title = title;
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <li class="nav-menu-item">${this.title}</li>
        `;
    }
}
