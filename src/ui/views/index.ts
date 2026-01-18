import { html } from "../../infra/html";
import { State, Emit } from "../../domain/models/state";
import header from "../components/general/header/header";
import mainContent from "../components/general/main-content/main-content";
import footer from "../components/footer/footer/footer";

export default (state: State, emit: Emit) => html`
    <body>
        ${header(state, emit)}
        ${mainContent(state, emit)}
        ${footer(state, emit)}
    </body>
`;
