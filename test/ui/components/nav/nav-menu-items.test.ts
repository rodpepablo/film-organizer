import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import {
    ADD_FILM_MENU,
    CREATE_ALBUM_MENU,
    CREATE_ALBUM_MODAL,
    LOAD_ALBUM_MENU,
} from "../../../../src/infra/constants";
import {
    ADD_FILM_REQUEST,
    LOAD_ALBUM_REQUEST,
    OPEN_MODAL,
} from "../../../../src/infra/events";
import { items } from "../../../../src/ui/components/nav/nav/nav-menu-items";

const DUMMY_STATE = {} as State;

describe("Nav menu items", () => {
    it("Create album should open create album modal on click", () => {
        const emit = vi.fn();
        const dom = items[CREATE_ALBUM_MENU].render(DUMMY_STATE, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(OPEN_MODAL, {
            modalId: CREATE_ALBUM_MODAL,
        });
    });

    it("Load album should emit a load album request", () => {
        const emit = vi.fn();
        const dom = items[LOAD_ALBUM_MENU].render(DUMMY_STATE, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(LOAD_ALBUM_REQUEST);
    });

    it("Add film roll should emit an add film request", () => {
        const emit = vi.fn();
        const dom = items[ADD_FILM_MENU].render(DUMMY_STATE, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(ADD_FILM_REQUEST);
    });
});
