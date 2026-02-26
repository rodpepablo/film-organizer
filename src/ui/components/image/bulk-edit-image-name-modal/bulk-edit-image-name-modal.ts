import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { BULK_EDIT_IMAGE_NAME_FORM } from "../../../../infra/constants";
import { BULK_EDIT_IMAGE_NAME_REQUEST } from "../../../../infra/events";
import { html } from "../../../../infra/html";
import Button from "../../general/button/button";
import Form from "../../general/form/form";
import HiddenInput from "../../general/input/hidden-input";
import Input from "../../general/input/input";

export default class BulkEditImageNameModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const form = new Form({
            formId: BULK_EDIT_IMAGE_NAME_FORM,
            submitEvent: BULK_EDIT_IMAGE_NAME_REQUEST,
            inputs: [
                new HiddenInput({ name: "filmId", label: "filmId" }),
                new Input({ name: "nameTemplate", label: "template" }),
            ],
            button: new Button({ input: "submit", value: "Edit" }),
        });

        return html`
            <div>
                <h5 class="center subtitle">Bulk Edit Image Name</h5>
                ${form.render(state, emit)}
            </div>
        `;
    }
}
