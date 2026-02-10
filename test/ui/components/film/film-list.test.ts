import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { FILM_DETAIL_SECTION } from "../../../../src/infra/constants";
import { NAVIGATE } from "../../../../src/infra/events";
import filmList from "../../../../src/ui/components/film/film-list/film-list";
import { aFilm, anAlbum } from "../../../test-util/fixtures";

describe("Film List Component", () => {
    it("Should load a message if no album loaded", () => {
        const state = { album: null };

        const dom = filmList(state as State, () => { });

        expect(dom.querySelector(".film-list-empty-msg")).not.toBeNull();
        expect(dom.querySelectorAll(".film-list-item")).toHaveLength(0);
    });

    it("Should load a message if no films added to the loaded album", () => {
        const state = {
            album: anAlbum({ films: [] }),
        };

        const dom = filmList(state as State, () => { });

        expect(dom.querySelector(".film-list-empty-msg")).not.toBeNull();
        expect(dom.querySelectorAll(".film-list-item")).toHaveLength(0);
    });

    it("Should list films when loaded", () => {
        const state = {
            album: anAlbum({ films: [{ name: "film", path: "", images: [] }] }),
        };

        const dom = filmList(state as State, () => { });

        expect(dom.querySelectorAll(".film-list-item")).toHaveLength(1);
        expect(dom.querySelector(".film-list-empty-msg")).toBeNull();
    });

    it("Should emit a navigation event to a film when clicked", () => {
        const emit = vi.fn();
        const film1 = aFilm();
        const film2 = aFilm();

        const state = {
            album: anAlbum({ films: [film1, film2] }),
        };

        const dom = filmList(state as State, emit);
        dom.querySelector<HTMLElement>(`[film-id="${film1.id}"]`)?.click();

        expect(emit).toHaveBeenCalledWith(NAVIGATE, {
            to: [FILM_DETAIL_SECTION, film1.id],
        });
    });
});
