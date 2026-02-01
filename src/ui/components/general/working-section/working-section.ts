import { html } from "../../../../infra/html";
import "./working-section.css";
import { State, Emit } from "../../../../domain/models/state";
import filmSection from "../../film/film-section/film-section";

export default (state: State, emit: Emit) => {
    return html`
        <section id="working-section">
            ${filmSection(state, emit)}
        </section>
    `;
};
