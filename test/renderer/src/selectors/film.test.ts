import { describe, expect, it } from "vitest";
import { FILM_DETAIL_SECTION } from "../../../../src/infra/constants";
import {
    filmDetailSelector,
    filmInfoSelector,
    filmsSelector,
} from "../../../../src/renderer/src/selectors/film";
import { aFilm, aCollection } from "../../../test-util/fixtures";

describe("Films selector", () => {
    it("filmsSelector", () => {
        expect(filmsSelector({ collection: null })).toBeNull();

        const state = {
            collection: aCollection({
                films: [aFilm()],
            }),
        };
        expect(filmsSelector(state)).toStrictEqual(state.collection.films);
    });

    it("filmDetailSelector", () => {
        expect(filmDetailSelector({ collection: null, location: [] })).toBeNull();

        const film = aFilm();
        const state = {
            collection: aCollection({
                films: [film],
            }),
            location: [FILM_DETAIL_SECTION, film.id],
        };
        expect(filmDetailSelector(state)).toEqual(film);

        state.location = [FILM_DETAIL_SECTION, "other"];
        expect(filmDetailSelector(state)).toEqual(null);
    });

    it("filmInfoSelector", () => {
        expect(filmInfoSelector({ collection: null, selectedFilm: null })).toBeNull();

        const film = aFilm();
        const state = { collection: aCollection({ films: [film] }), selectedFilm: film.id };
        expect(filmInfoSelector(state)).toEqual(film.info);
    });
});
