import { html } from "../../infra/html";
import { State, Emit } from "../../domain/models/state";
import header from "../components/general/header/header";
import mainContent from "../components/general/main-content/main-content";
import footer from "../components/footer/footer/footer";
import ModalComponent from "../components/general/modal/modal";
import notifications from "../components/general/notifications/notifications";
import CreateAlbumModal from "../components/album/create-album-modal/create-album-modal";
import {
    CREATE_ALBUM_MODAL,
    EDIT_FILM_INFO_MODAL,
    EDIT_FILM_NAME_MODAL,
    EDIT_IMAGE_NAME_MODAL,
    FILM_INFO_MODAL,
} from "../../infra/constants";
import EditFilmNameModal from "../components/film/edit-film-name-modal/edit-film-name-modal";
import EditImageNameModal from "../components/film/edit-image-name-modal/edit-image-name-modal";
import FilmInfoModal from "../components/film/film-info-modal/film-info-modal";
import EditFilmInfoModal from "../components/film/edit-film-info-modal/edit-film-info-modal";

const modal = new ModalComponent({
    [CREATE_ALBUM_MODAL]: new CreateAlbumModal(),
    [EDIT_FILM_NAME_MODAL]: new EditFilmNameModal(),
    [EDIT_IMAGE_NAME_MODAL]: new EditImageNameModal(),
    [FILM_INFO_MODAL]: new FilmInfoModal(),
    [EDIT_FILM_INFO_MODAL]: new EditFilmInfoModal(),
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
