import "./button.css";
import { html } from "../../../../infra/html";
import Component from "../../../../infra/component";
import { State, Emit } from "../../../../domain/models/state";

type ButtonConfig = {
    value: string;
    input?: "submit" | "button";
    type?: "tiny" | "";
    onclick?: (e: DOMEvent) => void;
};

export default class Button implements Component {
    config: ButtonConfig;

    constructor(config: ButtonConfig) {
        this.config = config;
    }

    render(state: State, emit: Emit): HTMLButtonElement {
        const type = this.config.input || "button";
        return html`
            <button
                class="${this.config.type + " button"}"
                type="${type}"
                onclick=${this.config.onclick}
            >
                ${this.config.value}
            </button>
        `;
    }
}
