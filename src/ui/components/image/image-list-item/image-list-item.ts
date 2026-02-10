import "./image-list-item.css";
import { FilmImage } from "../../../../domain/models/film";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";

export default class ImageListItem implements Component {
    image: FilmImage;

    constructor(image: FilmImage) {
        this.image = image;
    }

    render(state: State, emit: Emit): HTMLElement {
        const imgPath = `safe-file://${this.image.path}`;
        return html`
            <li class="list-item image-list-item">
                <img class="image-list-item-preview" src="${imgPath}" />
                <div class="image-list-item-info">
                    <h6 class="image-list-item-name">${this.image.name}</h6>
                    <span class="image-list-item-ext">(${this.image.ext})</span>
                </div>
            </li>
        `;
    }
}
