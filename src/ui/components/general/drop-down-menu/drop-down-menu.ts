import "./drop-down-menu.css";
import { html } from "../../../../infra/html";
import Component from "../../../../infra/component";
import { State, Emit } from "../../../../domain/models/state";
import DropDownItem from "./drop-down-menu-item";
import { DOWN_ICON, UP_ICON } from "../../../../infra/constants";

export default class DropDown implements Component {
    private config: DropDownConfig;

    constructor(config: DropDownConfig) {
        this.config = config;
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <div class="drop-down">
                <button class="drop-down-button" onclick=${onClick} onblur=${onBlur}>
                    <iconify-icon icon="${DOWN_ICON}"></iconify-icon>
                    ${this.config.label}
                </button>
                <ul class="drop-down-list" hidden>
                    ${this.config.items.map((item) => item.render(state, emit))}
                </ul>
            </div>
        `;
    }
}

export type DropDownConfig = {
    label: string;
    items: DropDownItem[];
};

function onClick(e: DOMEvent) {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const itemList =
        target.parentElement.querySelector<HTMLElement>(".drop-down-list");
    const icon = target.querySelector("iconify-icon");
    if (itemList.hidden === true) {
        target.focus();
        itemList.hidden = false;
        icon.setAttribute("icon", UP_ICON);
    } else {
        target.blur();
        itemList.hidden = true;
        icon.setAttribute("icon", DOWN_ICON);
    }
}

function onBlur(e: FocusEvent) {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.parentElement.querySelector<HTMLElement>(".drop-down-list").hidden =
        true;
    const icon = target.parentElement.querySelector("iconify-icon");
    icon.setAttribute("icon", DOWN_ICON);
}
