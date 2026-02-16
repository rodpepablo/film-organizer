import "./image-list-item.css";
import { FilmImage } from "../../../../domain/models/film";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import Icon from "../../general/icon/icon";
import {
    EDIT_IMAGE_NAME_FORM,
    EDIT_IMAGE_NAME_MODAL,
} from "../../../../infra/constants";
import { updateForm, openModal } from "../../../../infra/actions/ui";

export default class ImageListItem implements Component {
    private image: FilmImage;
    private filmId: string;

    constructor(image: FilmImage, filmId: string) {
        this.image = image;
        this.filmId = filmId;
    }

    render(state: State, emit: Emit): HTMLElement {
        const imgPath = `safe-file://${this.image.path}`;
        const editNameIcon = new Icon({
            type: "actionable",
            icon: "mdi:pencil",
            onClick: this.onNameEdit(emit),
        });

        return html`
            <li class="list-item image-list-item" data-id="${this.image.id}">
                <img class="image-list-item-preview" src="${imgPath}" />
                <div class="image-list-item-info">
                    <h6 class="image-list-item-name">${this.image.name}</h6>
                    <span class="image-list-item-ext">(${this.image.ext})</span>
                    ${editNameIcon.render(state, emit)}
                </div>
            </li>
        `;
    }

    private onNameEdit(emit: Emit) {
        return (e: DOMEvent) => {
            e.stopPropagation();
            updateForm(emit, {
                formId: EDIT_IMAGE_NAME_FORM,
                values: {
                    filmId: this.filmId,
                    imageId: this.image.id,
                    name: this.image.name,
                },
            });
            openModal(emit, { modalId: EDIT_IMAGE_NAME_MODAL });
        };
    }
}
