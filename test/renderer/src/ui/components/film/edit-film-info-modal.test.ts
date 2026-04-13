import { describe, it, expect, vi } from "vitest";
import { EDIT_FILM_INFO_FORM } from "../../../../../../src/infra/constants";
import {
    EDIT_FILM_INFO_REQUEST,
    SHOW_FILM_INFO,
} from "../../../../../../src/infra/events";
import EditFilmInfoModal from "../../../../../../src/renderer/src/ui/components/film/edit-film-info-modal/edit-film-info-modal";
import { submitForm } from "../../../../../test-util/dom";
import {
    aFilm,
    aForm,
    aCollection,
    aState,
} from "../../../../../test-util/fixtures";
import { testHasInputs } from "../../../../../test-util/util";

describe("Edit Film Info Modal", () => {
    it("Should render all needed inputs", () => {
        const modal = new EditFilmInfoModal();

        const dom = modal.render(aState(), () => { });

        const expectedInputs = [
            { name: "filmId", type: "hidden" },
            { name: "camera", type: "text" },
            { name: "lens", type: "text" },
            { name: "filmStock", type: "text" },
            { name: "shotISO", type: "text" },
            { name: "filmStockExpiration", type: "text" },
        ];
        testHasInputs(dom, expectedInputs);
    });

    it("Should emit the edit film infor request event on submit", () => {
        const emit = vi.fn();
        const modal = new EditFilmInfoModal();

        const dom = modal.render(aState(), emit);
        submitForm(dom);

        expect(emit).toHaveBeenCalledWith(EDIT_FILM_INFO_REQUEST);
    });

    it("Should go back to view info modal on cancel", () => {
        const emit = vi.fn();
        const modal = new EditFilmInfoModal();
        const film = aFilm();
        const state = aState({
            collection: aCollection({
                films: [film],
            }),
            forms: {
                [EDIT_FILM_INFO_FORM]: aForm({
                    values: {
                        filmId: film.id,
                    },
                }),
            },
        });

        const dom = modal.render(state, emit);
        dom.querySelector<HTMLButtonElement>("button.cancel")?.click();

        expect(emit).toHaveBeenCalledWith(SHOW_FILM_INFO, { filmId: film.id });
    });
});
