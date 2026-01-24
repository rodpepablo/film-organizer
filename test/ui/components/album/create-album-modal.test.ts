import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { CREATE_ALBUM_REQUEST } from "../../../../src/infra/events";
import CreateAlbumModal from "../../../../src/ui/components/album/create-album-modal/create-album-modal";
import { jsdomWindow } from "../../../../src/infra/html";
import { mockFormData } from "../../../test-util/mocking";

const window = jsdomWindow();

describe("Create album modal", () => {
    it("Should emit a create event with the form info", () => {
        const modal = new CreateAlbumModal(mockFormData());
        const emit = vi.fn();

        const dom = modal.render({} as State, emit);
        dom.querySelector<HTMLInputElement>("input[name=albumName]")!.value =
            "NAME";
        dom.querySelector("form")?.dispatchEvent(
            new window.Event("submit", {
                bubbles: true,
                cancelable: true,
            }),
        );

        expect(emit).toHaveBeenCalledWith(CREATE_ALBUM_REQUEST, { name: "NAME" });
    });
});
