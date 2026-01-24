import { CREATE_ALBUM_REQUEST } from "../../../../infra/events";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import { CreateAlbumParams } from "../../../../domain/stores/album";
import Form from "../../general/form/form";

export default class CreateAlbumModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const config = { onSubmit: this.onSubmit.bind(this) };
        const form = new Form(
            config,
            html`
                <input name="albumName" type="text" />
                <button type="submit">Create</button>
            `,
        );

        return html`
            <div>
                <h5>Create Album Modal</h5>
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
