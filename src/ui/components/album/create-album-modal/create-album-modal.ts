import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";

export default class CreateAlbumModal implements Component {
    render(state: State, emit: Emit) {
        return html`<h5>Create Album Modal</h5>`;
    }
}
