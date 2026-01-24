import { CREATE_ALBUM_REQUEST } from "../../../../infra/events";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import { CreateAlbumParams } from "../../../../domain/stores/album";
import Form from "../../general/form/form";
import Button from "../../general/button/button";
import Input from "../../general/input/input";

export default class CreateAlbumModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const config = { onSubmit: this.onSubmit.bind(this) };
        const form = new Form(
            config,
            html`
                ${Input({ type: "text", name: "albumName", label: "name" })}
                ${Button({ type: "submit", value: "Create" })}
            `,
        );

        return html`
            <div>
                <h5 class="center subtitle">Create Album Modal</h5>
                ${form.render(state, emit)}
            </div>
        `;
    }

    onSubmit(emit: Emit, formData: FormData) {
        emit(CREATE_ALBUM_REQUEST, this.parseFormData(formData));
    }

    parseFormData(formData: FormData): CreateAlbumParams {
        return {
            name: formData.get("albumName") as string,
        };
    }
}
