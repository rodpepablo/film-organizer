import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../../../../src/domain/models/state";
import footer from "../../../../../../../src/renderer/src/ui/components/footer/footer/footer";
import { aCollection } from "../../../../../../test-util/fixtures";
import { SAVE_COLLECTION_REQUEST } from "../../../../../../../src/infra/events";

describe("Footer component", () => {
    it("Should not show collection information when collection not loaded", () => {
        const state = { collection: null } as State;
        const element = footer(state, vi.fn());
        expect(element.querySelector(".footer-collection")).toBeNull();
    });

    it("Should show collection information when collection loaded", () => {
        const state = { collection: aCollection() } as State;
        const element = footer(state, vi.fn());
        expect(
            element.querySelector(".footer-collection-title")?.innerHTML,
        ).toEqual(state.collection?.name);
    });

    it("Should emit a save request when clicking on save button", () => {
        const state = { collection: aCollection() } as State;
        const emit = vi.fn();

        const dom = footer(state, emit);
        dom.querySelector<HTMLElement>(".button")?.click();

        expect(emit).toHaveBeenCalledWith(SAVE_COLLECTION_REQUEST);
    });
});
