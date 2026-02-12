import { EDIT_FILM_NAME_REQUEST } from "../../../../infra/events";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import Form from "../../general/form/form";
import Button from "../../general/button/button";
import HiddenInput from "../../general/input/hidden-input";
import Input from "../../general/input/input";
import { EDIT_FILM_NAME_FORM } from "../../../../infra/constants";

export default class EditFilmNameModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const form = new Form({
            formId: EDIT_FILM_NAME_FORM,
            submitEvent: EDIT_FILM_NAME_REQUEST,
            inputs: [
                new HiddenInput({ name: "filmId", label: "id" }),
                new Input({ name: "name", label: "name" }),
            ],
            button: new Button({ input: "submit", value: "Create" }),
        });

        return html`
            <div>
                <h5 class="center subtitle">Edit Film Name</h5>
                ${form.render(state, emit)}
            </div>
        `;
    }
}
