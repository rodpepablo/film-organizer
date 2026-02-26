import "./film-detail-section.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import { filmDetailSelector } from "../../../../infra/selectors/film";
import ImageListItem from "../../image/image-list-item/image-list-item";
import {
    BULK_EDIT_IMAGE_NAME_FORM,
    BULK_EDIT_IMAGE_NAME_MODAL,
    EDIT_FILM_NAME_FORM,
    EDIT_FILM_NAME_MODAL,
} from "../../../../infra/constants";
import { Film } from "../../../../domain/models/film";
import Icon from "../../general/icon/icon";
import {
    updateForm,
    openModal,
    showFilmInfo,
} from "../../../../infra/actions/ui";
import { sortImageList } from "../../../../infra/actions/film";
import DropDown from "../../general/drop-down-menu/drop-down-menu";
import DropDownItem from "../../general/drop-down-menu/drop-down-menu-item";

export default (state: State, emit: Emit): HTMLElement => {
    const film = filmDetailSelector(state);

    if (film == null)
        return html`<article id="film-detail-section">Invalid film</article>`;

    const images = film.images.map((image) => new ImageListItem(image, film.id));

    const editIcon = new Icon({
        type: "actionable",
        icon: "mdi:pencil",
        onClick: editName(emit, film),
    });
    const infoIcon = new Icon({
        type: "actionable",
        icon: "mdi:info",
        onClick: showInfo(emit, film.id),
    });

    const dropdown = new DropDown({
        label: "Actions",
        items: [
            new DropDownItem({
                label: "Bulk name edit",
                onClick: bulkNameEditClick(emit, film),
            }),
        ],
    });

    const content = html`
        <article id="film-detail-section">
            <header class="film-detail-header">
                <h4 class="film-detail-header-title">
                    <span>Film:</span>${film.name}
                </h4>
                <div class="film-detail-header-icons">
                    ${editIcon.render(state, emit)}
                    ${infoIcon.render(state, emit)}
                </div>
                <div class="separator"></div>
                ${dropdown.render(state, emit)}
            </header>
            <section class="film-detail-images">
                <ul class="film-detail-image-list list">
                    <sortable-list>
                        ${images.map((image) => image.render(state, emit))}
                    </sortable-list>
                </ul>
            </section>
        </article>
    `;

    content
        .querySelector("sortable-list")
        .addEventListener("sorted", onSorted(emit, film.id));

    return content;
};

function onSorted(emit: Emit, filmId: string) {
    return (e: CustomEvent) => {
        e.stopPropagation();
        sortImageList(emit, {
            filmId,
            newOrder: e.detail.newOrder,
        });
    };
}

function editName(emit: Emit, film: Film) {
    return (e: DOMEvent) => {
        e.preventDefault();
        updateForm(emit, {
            formId: EDIT_FILM_NAME_FORM,
            values: { filmId: film.id, name: film.name },
        });
        openModal(emit, {
            modalId: EDIT_FILM_NAME_MODAL,
        });
    };
}

function showInfo(emit: Emit, filmId: string) {
    return (e: DOMEvent) => {
        e.preventDefault();
        showFilmInfo(emit, { filmId: filmId });
    };
}

function bulkNameEditClick(emit: Emit, film: Film) {
    return (e: DOMEvent) => {
        e.stopPropagation();
        openModal(emit, { modalId: BULK_EDIT_IMAGE_NAME_MODAL });
        updateForm(emit, {
            formId: BULK_EDIT_IMAGE_NAME_FORM,
            values: { filmId: film.id, nameTemplate: film.bulkNameEditTemplate },
        });
    };
}
