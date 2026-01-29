import { describe, it, expect } from "vitest";
import {
    albumNameSelector,
    albumSelector,
} from "../../../src/infra/selectors/album";
import { anAlbum } from "../../test-util/fixtures";

const ALBUM = anAlbum();

describe("Album selectors", () => {
    it("albumSelector should return then album in the state or null", () => {
        expect(albumSelector({ album: null })).toBeNull();
        expect(albumSelector({ album: ALBUM })).toBe(ALBUM);
    });

    it("albumNameSelector should return name when album is loaded", () => {
        const state = { album: ALBUM };

        expect(albumNameSelector(state)).toEqual(ALBUM.name);
    });

    it("albumNameSelector should be null when no album loaded", () => {
        const state = { album: null };

        expect(albumNameSelector(state)).toEqual(null);
    });
});
