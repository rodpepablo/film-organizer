import { EDIT_IMAGE_NAME_REQUEST } from "../../../../../../infra/events";
import { State, Emit } from "../../../../../../domain/models/state";
import Component from "../../../component";
import { html } from "@html";
import Form from "../../general/form/form";
import Button from "../../general/button/button";
import HiddenInput from "../../general/input/hidden-input";
import Input from "../../general/input/input";
import { EDIT_IMAGE_NAME_FORM } from "../../../../../../infra/constants";

export default class EditImageNameModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const form = new Form({
            formId: EDIT_IMAGE_NAME_FORM,
            submitEvent: EDIT_IMAGE_NAME_REQUEST,
            inputs: [
                new HiddenInput({ name: "filmId", label: "id" }),
                new HiddenInput({ name: "imageId", label: "id" }),
                new Input({ name: "name", label: "name" }),
            ],
            button: new Button({ input: "submit", value: "Edit" }),
        });

        return html`
            <div>
                <h5 class="center subtitle">Edit Image Name</h5>
                ${form.render(state, emit)}
            </div>
        `;
    }
}
