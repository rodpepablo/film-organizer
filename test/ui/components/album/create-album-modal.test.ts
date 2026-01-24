import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { CREATE_ALBUM_REQUEST } from "../../../../src/infra/events";
import CreateAlbumModal from "../../../../src/ui/components/album/create-album-modal/create-album-modal";
import { setInputValueTo, submitForm } from "../../../test-util/dom";

const DUMMY_STATE = { forms: {} } as State;

describe("Create album modal", () => {
    it("Should emit a create event with the form info", () => {
        const modal = new CreateAlbumModal();
        const emit = vi.fn();

        const dom = modal.render(DUMMY_STATE, emit);
        setInputValueTo(dom, "albumName", "NAME");
        submitForm(dom);

        expect(emit).toHaveBeenCalledWith(CREATE_ALBUM_REQUEST, { name: "NAME" });
    });
});
