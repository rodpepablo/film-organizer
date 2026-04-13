import "./film-info-modal.css";
import { filmInfoSelector } from "../../../../selectors/film";
import { State, Emit } from "../../../../../../domain/models/state";
import Component from "../../../component";
import { html } from "@html";
import Button from "../../general/button/button";
import { FilmInfo } from "../../../../../../domain/models/film";
import { updateForm } from "../../../../actions/ui";
import { EDIT_FILM_INFO_FORM } from "../../../../../../infra/constants";
import { openModal } from "../../../../actions/ui";
import { EDIT_FILM_INFO_MODAL } from "../../../../../../infra/constants";
import NamedValueList from "../../general/named-value-list/named-value-list";

const infoItems: { label: string; name: keyof FilmInfo }[] = [
    { label: "Camera", name: "camera" },
    { label: "Lens", name: "lens" },
    { label: "Film Stock", name: "filmStock" },
    { label: "Shot ISO", name: "shotISO" },
    { label: "Film Expiration Status", name: "filmStockExpiration" },
];

export default class FilmInfoModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const info = filmInfoSelector(state)!;

        const items = new NamedValueList(
            infoItems.map((item) => ({ name: item.label, value: info[item.name] })),
        );

        const editButton = new Button({
            value: "Edit",
            input: "button",
            onclick: editMode(emit, info, state.selectedFilm!),
        });

        return html`
            <div class="film-info-modal">
                <h5 class="center subtitle modal-title">Film Info</h5>
                ${items.render(state, emit)}
                ${editButton.render(state, emit)}
            </div>
        `;
    }
}

function editMode(emit: Emit, info: FilmInfo, filmId: string) {
    return (e: DOMEvent) => {
        e.preventDefault();
        updateForm(emit, {
            formId: EDIT_FILM_INFO_FORM,
            values: {
                ...info,
                filmId,
            },
        });
        openModal(emit, {
            modalId: EDIT_FILM_INFO_MODAL,
        });
    };
}
