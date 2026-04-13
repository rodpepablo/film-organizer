import "./button.css";
import { html } from "@html";
import Component from "../../../component";
import { State, Emit } from "../../../../../../domain/models/state";

type ButtonConfig = {
    class?: string;
    value: string;
    input?: "submit" | "button";
    type?: "tiny" | "cancel" | "";
    onclick?: (e: Event) => void;
};

export default class Button implements Component {
    config: ButtonConfig;

    constructor(config: ButtonConfig) {
        this.config = config;
    }

    render(state: State, emit: Emit): HTMLElement {
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
