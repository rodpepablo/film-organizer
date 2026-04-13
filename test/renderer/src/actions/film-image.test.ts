import { describe, it } from "vitest";
import {
    CREATE_IMAGE_PREVIEW_REQUEST,
    EDIT_IMAGE_NAME_REQUEST,
} from "../../../../src/infra/events";
import { testAction } from "../../../test-util/util";
import {
    createImagePreviewRequest,
    editImageNameRequest,
} from "../../../../src/renderer/src/actions/film-image";

describe("FilmImage Actions", () => {
    it("Should expose actions", () => {
        testAction(editImageNameRequest, EDIT_IMAGE_NAME_REQUEST);
        testAction(createImagePreviewRequest, CREATE_IMAGE_PREVIEW_REQUEST, {
            imageId: "123",
        });
    });
});
