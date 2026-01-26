import { html } from "../../infra/html";
import { State, Emit } from "../../domain/models/state";
import header from "../components/general/header/header";
import mainContent from "../components/general/main-content/main-content";
import footer from "../components/footer/footer/footer";
import ModalComponent from "../components/general/modal/modal";
import notifications from "../components/general/notifications/notifications";
import CreateAlbumModal from "../components/album/create-album-modal/create-album-modal";
import { CREATE_ALBUM_MODAL } from "../../infra/constants";

const modal = new ModalComponent({
    [CREATE_ALBUM_MODAL]: new CreateAlbumModal(),
});

export default (state: State, emit: Emit) => html`
    <body>
        ${header(state, emit)}
        ${mainContent(state, emit)}
        ${footer(state, emit)}
        ${modal.render(state, emit)}
        ${notifications(state, emit)}
    </body>
`;
