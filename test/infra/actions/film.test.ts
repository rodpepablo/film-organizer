import { describe, it } from "vitest";
import {
    ADD_FILM_REQUEST,
    EDIT_FILM_NAME_REQUEST,
} from "../../../src/infra/events";
import { addFilm, editFilmName } from "../../../src/infra/actions/film";
import { testAction } from "../../test-util/util";

describe("Film actions", () => {
    it("Should expose actions", () => {
        testAction(addFilm, ADD_FILM_REQUEST);
        testAction(editFilmName, EDIT_FILM_NAME_REQUEST);
    });
});
