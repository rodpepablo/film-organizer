import { html } from "../../../../infra/html";
import "./main-content.css";
import { State, Emit } from "../../../../domain/models/state";
import nav from "../../nav/nav/nav";
import workingSection from "../working-section/working-section";

export default (state: State, emit: Emit) => html`
    <main id="main-content">
        ${nav(state, emit)}
        ${workingSection(state, emit)}
    </main>
`;
