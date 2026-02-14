import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { Film } from "../../../../domain/models/film";

export default class FilmListItem implements Component {
    film: Film;
    constructor(film: Film) {
        this.film = film;
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <li class="film-list-item list-item" data-id="${this.film.id}">
                ${this.film.name}
            </li>
        `;
    }
}
