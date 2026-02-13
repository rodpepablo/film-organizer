import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import {
    EDIT_FILM_NAME_FORM,
    EDIT_FILM_NAME_MODAL,
    FILM_DETAIL_SECTION,
} from "../../../../src/infra/constants";
import {
    OPEN_MODAL,
    SORT_IMAGE_LIST,
    UPDATE_FORM,
} from "../../../../src/infra/events";
import filmDetailSection from "../../../../src/ui/components/film/film-detail-section/film-detail-section";
import { safeDispatchCustomEvent } from "../../../test-util/dom";
import { aFilm, anAlbum, anImage } from "../../../test-util/fixtures";

describe("FilmDetailSection Component", () => {
    it("Should load message when no film selected", () => {
        const state = { album: null } as State;

        const dom = filmDetailSection(state, () => { });

        expect(dom.innerHTML).toEqual("Invalid film");
    });

    it("Should show film name in the header", () => {
        const film = aFilm();
        const state = {
            album: anAlbum({ films: [film] }),
            location: [FILM_DETAIL_SECTION, film.id],
        } as State;

        const dom = filmDetailSection(state, () => { });

        expect(dom.querySelector(".film-detail-header-title")?.innerHTML).toEqual(
            `<span>Film:</span>${film.name}`,
        );
    });

    it("Should show a list of film images", () => {
        const image1 = anImage({ name: "image1" });
        const image2 = anImage({ name: "image2" });
        const film = aFilm({ images: [image1, image2] });
        const state = {
            album: anAlbum({ films: [film] }),
            location: [FILM_DETAIL_SECTION, film.id],
        } as State;

        const dom = filmDetailSection(state, () => { });

        const foundImagesNames = Array.from(
            dom.querySelectorAll(".image-list-item-name"),
        ).map((element) => element.innerHTML);
        expect(foundImagesNames).toStrictEqual([image1.name, image2.name]);
    });

    it("Should open modal with id and name preloaded to edit film name", () => {
        const film = aFilm();
        const state = {
            album: anAlbum({ films: [film] }),
            location: [FILM_DETAIL_SECTION, film.id],
        } as State;
        const emit = vi.fn();

        const dom = filmDetailSection(state, emit);
        dom.querySelector<HTMLElement>("[icon='mdi:pencil']")?.click();

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            formId: EDIT_FILM_NAME_FORM,
            values: { filmId: film.id, name: film.name },
        });
        expect(emit).toHaveBeenCalledWith(OPEN_MODAL, {
            modalId: EDIT_FILM_NAME_MODAL,
        });
    });

    it("Should emit a sortImageList event when list is sorted with dragndrop", () => {
        const emit = vi.fn();
        const film = aFilm({ images: [anImage(), anImage()] });

        const state = {
            album: anAlbum({ films: [film] }),
            location: [FILM_DETAIL_SECTION, film.id],
        } as State;

        const dom = filmDetailSection(state, emit);
        safeDispatchCustomEvent(
            dom.querySelector<HTMLElement>("sortable-list")!,
            "sorted",
            {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    newOrder: ["1", "2"],
                },
            },
        );

        expect(emit).toHaveBeenCalledWith(SORT_IMAGE_LIST, {
            filmId: film.id,
            newOrder: ["1", "2"],
        });
    });
});
