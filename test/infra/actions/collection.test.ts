import { describe, it } from "vitest";
import {
    CREATE_COLLECTION_REQUEST,
    LOAD_COLLECTION_REQUEST,
    SAVE_COLLECTION_REQUEST,
    SORT_FILM_LIST,
} from "../../../src/infra/events";
import {
    createCollection,
    loadCollection,
    saveCollection,
    sortFilmList,
} from "../../../src/infra/actions/collection";
import { testAction } from "../../test-util/util";

describe("Collection actions", () => {
    it("Should expose actions", () => {
        testAction(createCollection, CREATE_COLLECTION_REQUEST);
        testAction(loadCollection, LOAD_COLLECTION_REQUEST);
        testAction(saveCollection, SAVE_COLLECTION_REQUEST);
        testAction(sortFilmList, SORT_FILM_LIST, { newOrder: ["1", "2"] });
    });
});
