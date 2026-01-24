import "./form.css";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import { mockFormData } from "../../../../../test/test-util/form-data";

type SubmitHandler = (emit: Emit, formData: FormData) => void;
type FormConfig = {
    onSubmit: SubmitHandler;
};

export default class Form implements Component {
    config: FormConfig;
    content: HTMLElement;

    constructor(config: FormConfig, content: HTMLElement) {
        this.config = config;
        this.content = content;
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <form class="form" onsubmit=${this.handleSubmit(emit)}>${this.content}</form>
        `;
    }

    getFormData() {
        return process.env.NODE_ENV !== "test" ? FormData : mockFormData();
    }

    handleSubmit(emit: Emit) {
        return (e: DOMEvent) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const _FormData = this.getFormData();
            const formData = new _FormData(form);
            this.config.onSubmit(emit, formData);
        };
    }
}
