import "./input.css";
import { html } from "../../../../infra/html";

type InputConfig = {
    type: "text" | "number";
    name?: string;
    label: string;
};

export default function Input(config: InputConfig) {
    return html`
        <div class="input-container">
            <label class="input-label">${config.label}:</label>
            <input class="input" type="${config.type}" name="${config.name || ""}"/>
        </div>
    `;
}
