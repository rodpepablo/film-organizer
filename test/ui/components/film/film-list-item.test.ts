import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import FilmListItem from "../../../../src/ui/components/film/film-list/film-list-item";
import { aFilm } from "../../../test-util/fixtures";

describe("FilmListItem Component", () => {
    it("Should set the data-id attribute with the filmId", () => {
        const film = aFilm();
        const filmListItem = new FilmListItem(film);

        const dom = filmListItem.render({} as State, () => { });

        expect(dom.getAttribute("data-id")).toEqual(film.id);
    });
});
