import { html } from "../../../../infra/html";
import "./working-section.css";
import { State, Emit } from "../../../../domain/models/state";

export default (state: State, emit: Emit) => {
    return html`
        <section id="working-section">Section</section>
    `;
};
