import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";

export default class DropDownItem implements Component {
    private config: DropDownItemConfig;

    constructor(config: DropDownItemConfig) {
        this.config = config;
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`<li class="drop-down-item" onmousedown=${this.config.onClick}>
            ${this.config.label}
        </li>`;
    }
}

export type DropDownItemConfig = {
    label: string;
    onClick: (e: DOMEvent) => void;
};
