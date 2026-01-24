import "./button.css";
import { html } from "../../../../infra/html";

type ButtonConfig = {
    value: string;
    type?: "submit" | "button";
};

export default function Button(config: ButtonConfig) {
    const type = config.type || "button";
    return html`<button class="button" type="${type}">${config.value}</button>`;
}
