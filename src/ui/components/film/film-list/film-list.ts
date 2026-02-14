import "./film-list.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import { filmsSelector } from "../../../../infra/selectors/film";
import FilmListItem from "./film-list-item";
import { FILM_DETAIL_SECTION } from "../../../../infra/constants";
import { navigate } from "../../../../infra/actions/ui";
import { SORT_FILM_LIST } from "../../../../infra/events";

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

    const content = html`
        <ul class="film-list list" onclick=${onClick(emit)}>
            <sortable-list>
                ${filmItems.map((film) => film.render(state, emit))}
            </sortable-list>
        </ul>
    `;

    content
        .querySelector("sortable-list")
        ?.addEventListener("sorted", onSorted(emit));

    return content;
};

function onClick(emit: Emit) {
    return (e: DOMEvent) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        navigate(emit, {
            to: [FILM_DETAIL_SECTION, target.getAttribute("data-id")],
        });
    };
}

function onSorted(emit: Emit) {
    return (e: CustomEvent) => {
        e.stopPropagation();
        emit(SORT_FILM_LIST, { newOrder: e.detail.newOrder });
    };
}
