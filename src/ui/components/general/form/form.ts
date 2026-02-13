import "./form.css";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import {
    uiFormErrorSelector,
    uiFormValuesSelector,
} from "../../../../infra/selectors/ui";
import { IInput } from "../input/input";
import Button from "../button/button";
import { updateForm } from "../../../../infra/actions/ui";

type FormConfig = {
    formId: string;
    submitEvent: string;
    inputs: IInput[];
    button?: Button;
};

export default class Form implements Component {
    config: FormConfig;

    constructor(config: FormConfig) {
        this.config = config;
    }

    render(state: State, emit: Emit): HTMLElement {
        const error = uiFormErrorSelector(state, this.config.formId);
        const values = uiFormValuesSelector(state, this.config.formId);

        if (values != null)
            this.config.inputs.forEach((input) => input.setValue(values[input.name]));
        const inputs = this.config.inputs.map((input) => input.render(state, emit));

        const button =
            this.config.button != null
                ? this.config.button.render(state, emit)
                : new Button({ value: "Send", input: "submit" }).render(state, emit);

        return html`
            <form class="form" onsubmit=${this.handleSubmit(emit)} onchange=${this.handleChange(emit)}>
                ${error != null ? html`<span class="form-error">${error}</span>` : null}
                ${inputs}
                ${button}
            </form>
        `;
    }

    private emitFormUpdate(emit: Emit, form: HTMLFormElement) {
        const values = Array.from(form.querySelectorAll<HTMLInputElement>("input"))
            .filter((input) => input.hasAttribute("name"))
            .map((input) => ({
                name: input.getAttribute("name"),
                value: input.value,
            }))
            .reduce((acc: any, input: { name: string; value: any }) => {
                acc[input.name] = input.value;
                return acc;
            }, {});
        updateForm(emit, { formId: this.config.formId, values });
    }

    private handleChange(emit: Emit) {
        return (e: DOMEvent) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            this.emitFormUpdate(emit, form);
        };
    }

    private handleSubmit(emit: Emit) {
        return (e: DOMEvent) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            this.emitFormUpdate(emit, form);
            emit(this.config.submitEvent);
        };
    }
}
