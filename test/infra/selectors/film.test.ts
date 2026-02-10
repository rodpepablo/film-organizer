import { describe, expect, it } from "vitest";
import { FILM_DETAIL_SECTION } from "../../../src/infra/constants";
import {
    filmDetailSelector,
    filmsSelector,
} from "../../../src/infra/selectors/film";
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

    it("filmDetailSelector", () => {
        expect(filmDetailSelector({ album: null, location: [] })).toBeNull();

        const film = aFilm();
        const state = {
            album: anAlbum({
                films: [film],
            }),
            location: [FILM_DETAIL_SECTION, film.id],
        };
        expect(filmDetailSelector(state)).toEqual(film);

        state.location = [FILM_DETAIL_SECTION, "other"];
        expect(filmDetailSelector(state)).toEqual(null);
    });
});
