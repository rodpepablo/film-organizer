import "./header.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";

export default (state: State, emit: Emit) => html`
    <header id="app-header"><h1>Film Organizer</h1></header>
`;
