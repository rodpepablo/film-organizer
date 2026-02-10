import { CREATE_ALBUM_REQUEST } from "../../../../infra/events";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import Form from "../../general/form/form";
import button from "../../general/button/button";
import Input from "../../general/input/input";
import { CREATE_ALBUM_FORM } from "../../../../infra/constants";

export default class CreateAlbumModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const form = new Form(
            {
                formId: CREATE_ALBUM_FORM,
                submitEvent: CREATE_ALBUM_REQUEST,
            },
            html`
                ${Input({ type: "text", name: "name", label: "name" })}
                ${button({ input: "submit", value: "Create" })}
            `,
        );

        return html`
            <div>
                <h5 class="center subtitle">Create Album Modal</h5>
                ${form.render(state, emit)}
            </div>
        `;
    }
}
