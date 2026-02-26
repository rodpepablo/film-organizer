import { describe, it } from "vitest";
import EditImageNameModal from "../../../../src/ui/components/film/edit-image-name-modal/edit-image-name-modal";
import { aState } from "../../../test-util/fixtures";
import { testHasInputs } from "../../../test-util/util";

describe("Edit Image Name Modal", () => {
    it("should contain the needed inputs", () => {
        const modal = new EditImageNameModal();

        const dom = modal.render(aState(), () => { });

        const expectedInputs = [
            { name: "filmId", type: "hidden" },
            { name: "imageId", type: "hidden" },
            { name: "name", type: "text" },
        ];
        testHasInputs(dom, expectedInputs);
    });
});
