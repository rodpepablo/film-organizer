import { describe, it, expect, vi } from "vitest";
import { aFilm, anAlbum } from "../../../test-util/fixtures";
import FilmInfoModal from "../../../../src/ui/components/film/film-info-modal/film-info-modal";
import { State } from "../../../../src/domain/models/state";
import { OPEN_MODAL, UPDATE_FORM } from "../../../../src/infra/events";
import {
    EDIT_FILM_INFO_FORM,
    EDIT_FILM_INFO_MODAL,
} from "../../../../src/infra/constants";

describe("FilmInfoModal", () => {
    it("Should show film info", () => {
        const emit = vi.fn();
        const film = aFilm();
        const state = { album: anAlbum({ films: [film] }), selectedFilm: film.id };

        const filmInfoModal = new FilmInfoModal();
        const dom = filmInfoModal.render(state as State, emit);

        const li = Array.from(dom.querySelectorAll<HTMLElement>("li")).map(
            (el) => el.innerHTML.split("</b>")[1],
        );

        expect(li).toContain(film.info.camera);
        expect(li).toContain(film.info.lens);
        expect(li).toContain(film.info.filmStock);
        expect(li).toContain(film.info.shotISO?.toString());
        expect(li).toContain(film.info.filmStockExpiration);
    });

    it("Should emit an open modal and update the form of the edit view on button click", () => {
        const emit = vi.fn();
        const film = aFilm();
        const state = { album: anAlbum({ films: [film] }), selectedFilm: film.id };

        const filmInfoModal = new FilmInfoModal();
        const dom = filmInfoModal.render(state as State, emit);
        dom.querySelector<HTMLElement>("button")?.click();

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            formId: EDIT_FILM_INFO_FORM,
            values: {
                ...film.info,
                filmId: film.id,
            },
        });
        expect(emit).toHaveBeenCalledWith(OPEN_MODAL, {
            modalId: EDIT_FILM_INFO_MODAL,
        });
    });
});
