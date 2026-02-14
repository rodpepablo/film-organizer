import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { FILM_DETAIL_SECTION } from "../../../../src/infra/constants";
import { NAVIGATE, SORT_FILM_LIST } from "../../../../src/infra/events";
import filmList from "../../../../src/ui/components/film/film-list/film-list";
import { aFilm, anAlbum } from "../../../test-util/fixtures";
import { safeDispatchCustomEvent } from "../../../test-util/dom";

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
            album: anAlbum({ films: [aFilm()] }),
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
        dom.querySelector<HTMLElement>(`[data-id="${film1.id}"]`)?.click();

        expect(emit).toHaveBeenCalledWith(NAVIGATE, {
            to: [FILM_DETAIL_SECTION, film1.id],
        });
    });

    it("Should emit a sort film list event when action received by sortable-list", () => {
        const emit = vi.fn();
        const state = {
            album: anAlbum({ films: [aFilm(), aFilm()] }),
        } as State;

        const dom = filmList(state, emit);
        safeDispatchCustomEvent(dom.querySelector("sortable-list")!, "sorted", {
            detail: { newOrder: ["2", "1"] },
        });

        expect(emit).toHaveBeenCalledWith(SORT_FILM_LIST, { newOrder: ["2", "1"] });
    });
});
