import "./input.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";

type InputConfig = {
    name: string;
    label: string;
};

export interface IInput extends Component {
    value: any;
    name: string;
    setValue(value: string): void;
}

export default class Input implements IInput {
    private config: InputConfig;
    value: string;
    private type: string = "text";
    name: string;

    constructor(config: InputConfig) {
        this.config = config;
        this.value = "";
        this.name = config.name;
    }

    setValue(value: string) {
        this.value = value;
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <div class="input-container">
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
