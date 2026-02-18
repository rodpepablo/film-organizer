import "./button.css";
import { html } from "../../../../infra/html";
import Component from "../../../../infra/component";
import { State, Emit } from "../../../../domain/models/state";

type ButtonConfig = {
    class?: string;
    value: string;
    input?: "submit" | "button";
    type?: "tiny" | "cancel" | "";
    onclick?: (e: DOMEvent) => void;
};

export default class Button implements Component {
    config: ButtonConfig;

    constructor(config: ButtonConfig) {
        this.config = config;
    }

    render(state: State, emit: Emit): HTMLButtonElement {
        const type = this.config.input || "button";
        const classes = ["button"];
        if (this.config.type != null) {
            classes.push(this.config.type);
        }
        if (this.config.class != null) {
            classes.push(this.config.class);
        }

        return html`
            <button
                class="${classes.join(" ")}"
                type="${type}"
                onclick=${this.config.onclick}
            >
                ${this.config.value}
            </button>
        `;
    }
}
