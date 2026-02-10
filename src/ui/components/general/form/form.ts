import "./form.css";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import { mockFormData } from "../../../../../test/test-util/form-data";
import { uiFormErrorSelector } from "../../../../infra/selectors/ui";
import { UPDATE_FORM } from "../../../../infra/events";

type FormConfig = {
    formId: string;
    submitEvent: string;
};

export default class Form implements Component {
    config: FormConfig;
    content: HTMLElement;

    constructor(config: FormConfig, content: HTMLElement) {
        this.config = config;
        this.content = content;
    }

    render(state: Pick<State, "forms">, emit: Emit): HTMLElement {
        const error = uiFormErrorSelector(state, this.config.formId);

        return html`
            <form class="form" onsubmit=${this.handleSubmit(emit)} onchange=${this.handleChange(emit)}>
                ${error != null ? html`<span class="form-error">${error}</span>` : null}
                ${this.content}
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
        emit(UPDATE_FORM, { form: this.config.formId, values });
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
