import "./film-list.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import { filmsSelector } from "../../../../infra/selectors/film";
import FilmListItem from "./film-list-item";
import { FILM_DETAIL_SECTION } from "../../../../infra/constants";
import { navigate } from "../../../../infra/actions/ui";

export default (state: State, emit: Emit): HTMLElement => {
    const films = filmsSelector(state);

    if (films == null || films.length === 0)
        return html`
            <div class="film-list-empty">
                <h4 class="film-list-empty-msg center">
                    No films added to the album
                </h4>
            </div>
        `;

    const filmItems = films.map((film) => new FilmListItem(film));

    return html`
        <ul class="film-list list" onclick=${onClick(emit)}>
            ${filmItems.map((film) => film.render(state, emit))}
        </ul>
    `;
};

function onClick(emit: Emit) {
    return (e: DOMEvent) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        navigate(emit, {
            to: [FILM_DETAIL_SECTION, target.getAttribute("film-id")],
        });
    };
}
