import { describe, it, expect, vi } from "vitest";
import footer from "../../../../../src/ui/components/footer/footer/footer";

describe("Footer component", () => {
    it("Should not show album information when album not loaded", () => {
        const state = { album: null };
        const element = footer(state, vi.fn());
        expect(element.querySelector(".footer-album")).toBeNull();
    });

    it("Should show album information when album loaded", () => {
        const state = { album: { name: "ALBUM_NAME" } };
        const element = footer(state, vi.fn());
        expect(element.querySelector(".footer-album-title")?.innerHTML).toEqual(
            "ALBUM_NAME",
        );
    });
});
