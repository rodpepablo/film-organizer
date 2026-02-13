import { describe, it } from "vitest";
import {
    CREATE_ALBUM_REQUEST,
    LOAD_ALBUM_REQUEST,
    SAVE_ALBUM_REQUEST,
} from "../../../src/infra/events";
import {
    createAlbum,
    loadAlbum,
    saveAlbum,
} from "../../../src/infra/actions/album";
import { testAction } from "../../test-util/util";

describe("Album actions", () => {
    it("Should expose actions", () => {
        testAction(createAlbum, CREATE_ALBUM_REQUEST);
        testAction(loadAlbum, LOAD_ALBUM_REQUEST);
        testAction(saveAlbum, SAVE_ALBUM_REQUEST);
    });
});
