import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import NavMenuItem from "../../../../src/ui/components/nav/nav-menu-item/nav-menu-item";

describe("NavMenuItem", () => {
    it("should execute the dispatch fn on click", () => {
        const emit = vi.fn();
        const dispatcher = vi.fn();
        const item = new NavMenuItem("Some Text", dispatcher);
        const dom = item.render({} as State, emit);
        dom.click();

        expect(dispatcher).toHaveBeenCalledWith(emit);
    });
});
