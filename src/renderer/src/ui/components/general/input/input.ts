import "./input.css";
import { html } from "@html";
import { State, Emit } from "../../../../../../domain/models/state";
import Component from "../../../component";

export type InputConfig = {
    name: string;
    label: string;
};

export interface IInput extends Component {
    value?: any;
    name: string;
    setValue(value: any): void;
}

export default class Input implements IInput {
    private config: InputConfig;
    value: string;
    protected type: string = "text";
    name: string;

    constructor(config: InputConfig) {
        this.config = config;
        this.value = "";
        this.name = config.name;
    }

    setValue(value: any) {
        this.value = value;
    }

    render(state: State, emit: Emit): HTMLElement {
        const containerClass =
            this.type === "hidden" ? "input-container hidden" : "input-container";

        return html`
            <div class="${containerClass}">
                <label class="input-label">${this.config.label}:</label>
                <input
                    class="input"
                    type="${this.type}"
                    name="${this.config.name}"
                    value="${this.value}"/>
            </div>
        `;
    }
}
