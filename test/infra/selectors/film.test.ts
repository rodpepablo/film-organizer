import { describe, expect, it } from "vitest";
import { filmsSelector } from "../../../src/infra/selectors/film";
import { aFilm, anAlbum } from "../../test-util/fixtures";

describe("Films selector", () => {
    it("filmsSelector", () => {
        expect(filmsSelector({ album: null })).toBeNull();

        const state = {
            album: anAlbum({
                films: [aFilm()],
            }),
        };
        expect(filmsSelector(state)).toStrictEqual(state.album.films);
    });
});
