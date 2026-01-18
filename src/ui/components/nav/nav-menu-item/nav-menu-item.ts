import { html } from "../../../../infra/html";
import "./nav-menu-item.css";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";

export default class NavMenuItem implements Component {
    title: string;
    dispatcher: (emit: Emit) => void;

    constructor(title: string, dispatcher: (emit: Emit) => void) {
        this.title = title;
        this.dispatcher = dispatcher;
    }

    onClick(emit: Emit) {
        return (e: DOMEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.dispatcher(emit);
        };
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <li class="nav-menu-item" onclick=${this.onClick(emit)}>${this.title}</li>
        `;
    }
}
