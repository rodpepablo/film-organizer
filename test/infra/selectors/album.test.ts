import { describe, it, expect } from "vitest";
import { albumNameSelector } from "../../../src/infra/selectors/album";

describe("Album selectors", () => {
    it("Album name should return name when album is loaded", () => {
        const state = {
            album: {
                name: "ALBUM NAME",
            },
        };
        expect(albumNameSelector(state)).toEqual("ALBUM NAME");
    });

    it("Album name should be null when no album loaded", () => {
        const state = { album: null };
        expect(albumNameSelector(state)).toEqual(null);
    });
});
