import { describe, it } from "vitest";
import {
    ADD_FILM_REQUEST,
    EDIT_FILM_NAME_REQUEST,
    SORT_IMAGE_LIST,
} from "../../../src/infra/events";
import {
    addFilm,
    editFilmName,
    sortImageList,
} from "../../../src/infra/actions/film";
import { testAction } from "../../test-util/util";

describe("Film actions", () => {
    it("Should expose actions", () => {
        testAction(addFilm, ADD_FILM_REQUEST);
        testAction(editFilmName, EDIT_FILM_NAME_REQUEST);
        testAction(sortImageList, SORT_IMAGE_LIST, { newOrder: ["1", "2"] });
    });
});
