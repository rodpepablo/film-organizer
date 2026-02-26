import { describe, expect, it, vi } from "vitest";
import { aState } from "../../../test-util/fixtures";
import { testHasInputs } from "../../../test-util/util";
import BulkEditImageNameModal from "../../../../src/ui/components/image/bulk-edit-image-name-modal/bulk-edit-image-name-modal";
import { submitForm } from "../../../test-util/dom";
import { BULK_EDIT_IMAGE_NAME_REQUEST } from "../../../../src/infra/events";

describe("Bulk edit Image Name Modal", () => {
    it("should contain the needed inputs and dispatch correct event", () => {
        const emit = vi.fn();
        const modal = new BulkEditImageNameModal();

        const dom = modal.render(aState(), emit);
        submitForm(dom);

        const expectedInputs = [
            { name: "filmId", type: "hidden" },
            { name: "nameTemplate", type: "text" },
        ];
        testHasInputs(dom, expectedInputs);
        expect(emit).toHaveBeenCalledWith(BULK_EDIT_IMAGE_NAME_REQUEST);
    });
});
