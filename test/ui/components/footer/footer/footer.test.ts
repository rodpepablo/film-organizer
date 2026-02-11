import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../../src/domain/models/state";
import footer from "../../../../../src/ui/components/footer/footer/footer";
import { anAlbum } from "../../../../test-util/fixtures";
import { SAVE_ALBUM_REQUEST } from "../../../../../src/infra/events";

describe("Footer component", () => {
    it("Should not show album information when album not loaded", () => {
        const state = { album: null } as State;
        const element = footer(state, vi.fn());
        expect(element.querySelector(".footer-album")).toBeNull();
    });

    it("Should show album information when album loaded", () => {
        const state = { album: anAlbum() } as State;
        const element = footer(state, vi.fn());
        expect(element.querySelector(".footer-album-title")?.innerHTML).toEqual(
            state.album?.name,
        );
    });

    it("Should emit a save request when clicking on save button", () => {
        const state = { album: anAlbum() } as State;
        const emit = vi.fn();

        const dom = footer(state, emit);
        dom.querySelector<HTMLElement>(".button")?.click();

        expect(emit).toHaveBeenCalledWith(SAVE_ALBUM_REQUEST);
    });
});
