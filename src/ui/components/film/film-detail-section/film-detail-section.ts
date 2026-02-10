import "./film-detail-section.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import { filmDetailSelector } from "../../../../infra/selectors/film";
import ImageListItem from "../../image/image-list-item/image-list-item";

export default (state: State, emit: Emit): HTMLElement => {
    const film = filmDetailSelector(state);

    if (film == null)
        return html`<article id="film-detail-section">Invalid film</article>`;

    const images = film.images.map((image) => new ImageListItem(image));

    return html`
        <article id="film-detail-section">
            <header class="film-detail-header">
                <h4 class="film-detail-header-title">
                    <span>Film:</span>${film.name}
                </h4>
            </header>
            <section class="film-detail-images">
                <ul class="film-detail-image-list list">
                    ${images.map((image) => image.render(state, emit))}
                </ul>
            </section>
        </article>
    `;
};
