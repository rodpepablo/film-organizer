import { describe, it } from "vitest";
import { EDIT_IMAGE_NAME_REQUEST } from "../../../src/infra/events";
import { testAction } from "../../test-util/util";
import { editImageNameRequest } from "../../../src/infra/actions/film-image";

describe("FilmImage Actions", () => {
    it("Should expose actions", () => {
        testAction(editImageNameRequest, EDIT_IMAGE_NAME_REQUEST);
    });
});
