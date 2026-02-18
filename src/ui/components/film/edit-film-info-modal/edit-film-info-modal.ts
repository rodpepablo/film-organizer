import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import Form from "../../general/form/form";
import { EDIT_FILM_INFO_FORM } from "../../../../infra/constants";
import { EDIT_FILM_INFO_REQUEST } from "../../../../infra/events";
import Input from "../../general/input/input";
import HiddenInput from "../../general/input/hidden-input";
import { uiFormValuesSelector } from "../../../../infra/selectors/ui";
import { EditFilmInfoValues } from "../../../../domain/stores/film";
import { showFilmInfo } from "../../../../infra/actions/ui";

export default class EditFilmInfoModal implements Component {
    render(state: State, emit: Emit): HTMLElement {
        const values: EditFilmInfoValues = uiFormValuesSelector(
            state,
            EDIT_FILM_INFO_FORM,
        );

        const form = new Form({
            formId: EDIT_FILM_INFO_FORM,
            onCancel: this.handleCancel(emit, values && values.filmId),
            submitEvent: EDIT_FILM_INFO_REQUEST,
            inputs: [
                new HiddenInput({ name: "filmId", label: "filmId" }),
                new Input({ name: "camera", label: "Camera" }),
                new Input({ name: "lens", label: "Lens" }),
                new Input({ name: "filmStock", label: "Film Stock" }),
                new Input({ name: "shotISO", label: "Shot ISO" }),
                new Input({
                    name: "filmStockExpiration",
                    label: "Film Stock Expiration",
                }),
            ],
        });

        return html`
            <div>
                <h5 class="center subtitle modal-title">Edit Film Info</h5>
                ${form.render(state, emit)}
            </div>
        `;
    }

    private handleCancel(emit: Emit, filmId: string) {
        return (e: DOMEvent) => {
            e.preventDefault();
            showFilmInfo(emit, { filmId });
        };
    }
}
