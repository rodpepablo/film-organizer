import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import filmList from "../../../../src/ui/components/film/film-list/film-list";
import { anAlbum } from "../../../test-util/fixtures";

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
            album: anAlbum({ films: [{ name: "film", path: "", images: [] }] }),
        };

        const dom = filmList(state as State, () => { });

        expect(dom.querySelectorAll(".film-list-item")).toHaveLength(1);
        expect(dom.querySelector(".film-list-empty-msg")).toBeNull();
    });
});
