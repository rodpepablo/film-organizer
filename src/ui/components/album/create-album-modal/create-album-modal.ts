import { CREATE_ALBUM_REQUEST } from "../../../../infra/events";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import { CreateAlbumParams } from "../../../../domain/stores/album";

export default class CreateAlbumModal implements Component {
    _FormData: any;
    constructor(_FormData?: any) {
        this._FormData = _FormData || FormData;
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <div>
                <h5>Create Album Modal</h5>
                <form onsubmit=${this.onSubmit(emit)}>
                    <input name="albumName" />
                    <button type="submit">Create</button>
                </form>
            </div>
        `;
    }

    onSubmit(emit: Emit) {
        return (e: DOMEvent) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new this._FormData(form);
            emit(CREATE_ALBUM_REQUEST, this.parseFormData(formData));
        };
    }

    parseFormData(formData: FormData): CreateAlbumParams {
        return {
            name: formData.get("albumName") as string,
        };
    }
}
