import "./film-section.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import filmList from "../film-list/film-list";

export default (state: State, emit: Emit) => {
    return html`
        <article id="film-section">
            <header class="film-section-header">
                <h3 class="film-section-title subsubtitle">Film list</h3>
            </header>
            ${filmList(state, emit)}
        </article>
    `;
};
