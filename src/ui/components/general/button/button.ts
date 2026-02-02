import "./button.css";
import { html } from "../../../../infra/html";

type ButtonConfig = {
    value: string;
    input?: "submit" | "button";
    type?: "tiny" | "";
    onclick?: (e: DOMEvent) => void;
};

export default function button(config: ButtonConfig): HTMLButtonElement {
    const type = config.input || "button";
    return html`<button class="${config.type + " button"}" type="${type}" onclick=${config.onclick}>
        ${config.value}
    </button>`;
}
