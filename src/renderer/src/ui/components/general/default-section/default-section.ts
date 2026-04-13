import "./default-section.css";
import { State, Emit } from "../../../../../../domain/models/state";
import { html } from "@html";

export default function defaultSection(state: State, emit: Emit): HTMLElement {
    return html`
        <section id="default-section">
            <h4 class="default-section-title">No collection selected</h4>
        </section>
    `;
}
