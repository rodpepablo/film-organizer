import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { CREATE_ALBUM_MODAL } from "../../../../src/infra/constants";
import { OPEN_MODAL } from "../../../../src/infra/events";
import { items } from "../../../../src/ui/components/nav/nav/nav-menu-items";

describe("Nav menu items", () => {
    it("Create album should open create album modal on click", () => {
        const emit = vi.fn();
        const dom = items[CREATE_ALBUM_MODAL].render({} as State, emit);
        dom.click();

        expect(emit).toHaveBeenCalledWith(OPEN_MODAL, {
            modalId: CREATE_ALBUM_MODAL,
        });
    });
});
