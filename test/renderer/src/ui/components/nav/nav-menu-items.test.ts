import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../../../src/domain/models/state";
import {
    ADD_FILM_MENU,
    CREATE_COLLECTION_MENU,
    CREATE_COLLECTION_MODAL,
    FILM_SECTION,
    LIST_FILMS_MENU,
    LOAD_COLLECTION_MENU,
} from "../../../../../../src/infra/constants";
import {
    ADD_FILM_REQUEST,
    LOAD_COLLECTION_REQUEST,
    NAVIGATE,
    OPEN_MODAL,
} from "../../../../../../src/infra/events";
import { items } from "../../../../../../src/renderer/src/ui/components/nav/nav/nav-menu-items";

const DUMMY_STATE = {} as State;

describe("Nav menu items", () => {
    it("Create collection should open create collection modal on click", () => {
        const emit = vi.fn();
        const dom = items[CREATE_COLLECTION_MENU].render(DUMMY_STATE, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(OPEN_MODAL, {
            modalId: CREATE_COLLECTION_MODAL,
        });
    });

    it("Load collection should emit a load collection request", () => {
        const emit = vi.fn();
        const dom = items[LOAD_COLLECTION_MENU].render(DUMMY_STATE, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(LOAD_COLLECTION_REQUEST);
    });

    it("List film rolls should emit a navigation event to the film section", () => {
        const emit = vi.fn();

        const dom = items[LIST_FILMS_MENU].render(DUMMY_STATE, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(NAVIGATE, { to: [FILM_SECTION] });
    });

    it("Add film roll should emit an add film request", () => {
        const emit = vi.fn();
        const dom = items[ADD_FILM_MENU].render(DUMMY_STATE, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(ADD_FILM_REQUEST);
    });
});
