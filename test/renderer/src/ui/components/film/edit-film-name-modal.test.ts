import { describe, it } from "vitest";
import EditFilmNameModal from "../../../../../../src/renderer/src/ui/components/film/edit-film-name-modal/edit-film-name-modal";
import { aState } from "../../../../../test-util/fixtures";
import { testHasInputs } from "../../../../../test-util/util";

describe("Edit Film Name Modal", () => {
    it("should contain the needed inputs", () => {
        const modal = new EditFilmNameModal();

        const dom = modal.render(aState(), () => { });

        const expectedInputs = [
            { name: "filmId", type: "hidden" },
            { name: "name", type: "text" },
        ];
        testHasInputs(dom, expectedInputs);
    });
});
