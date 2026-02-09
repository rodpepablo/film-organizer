import "./default-section.css";
import { State, Emit } from "../../../../domain/models/state";
import { html } from "../../../../infra/html";

export default function defaultSection(state: State, emit: Emit) {
    return html`
        <section id="default-section">
            <h4 class="default-section-title">No album selected</h4>
        </section>
    `;
}
