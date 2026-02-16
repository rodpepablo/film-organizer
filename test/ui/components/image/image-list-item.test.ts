import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import {
    EDIT_IMAGE_NAME_FORM,
    EDIT_IMAGE_NAME_MODAL,
} from "../../../../src/infra/constants";
import { OPEN_MODAL, UPDATE_FORM } from "../../../../src/infra/events";
import ImageListItem from "../../../../src/ui/components/image/image-list-item/image-list-item";
import { anImage } from "../../../test-util/fixtures";

const IMAGE = anImage({ path: "/to/image.jpg" });
const FILM_ID = "123";

describe("ImageListItem Component", () => {
    it("should update image path to use safe-file protocol", () => {
        const imageListItem = new ImageListItem(IMAGE, FILM_ID);

        const dom = imageListItem.render({} as State, () => { });

        expect(
            dom.querySelector(".image-list-item-preview")?.getAttribute("src"),
        ).toEqual("safe-file:///to/image.jpg");
    });

    it("should show image info", () => {
        const imageListItem = new ImageListItem(IMAGE, FILM_ID);

        const dom = imageListItem.render({} as State, () => { });

        expect(dom.querySelector(".image-list-item-name")?.innerHTML).toEqual(
            IMAGE.name,
        );
        expect(dom.querySelector(".image-list-item-ext")?.innerHTML).toEqual(
            `(${IMAGE.ext})`,
        );
    });

    it("should add data-id with the image id for sortable", () => {
        const imageListItem = new ImageListItem(IMAGE, FILM_ID);

        const dom = imageListItem.render({} as State, () => { });

        expect(dom.getAttribute("data-id")).toEqual(IMAGE.id);
    });

    it("should open form with current values to edit name when clicking on icon", () => {
        const imageListItem = new ImageListItem(IMAGE, FILM_ID);
        const emit = vi.fn();

        const dom = imageListItem.render({} as State, emit);
        dom.querySelector<HTMLElement>("iconify-icon")?.click();

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            formId: EDIT_IMAGE_NAME_FORM,
            values: {
                filmId: FILM_ID,
                imageId: IMAGE.id,
                name: IMAGE.name,
            },
        });
        expect(emit).toHaveBeenCalledWith(OPEN_MODAL, {
            modalId: EDIT_IMAGE_NAME_MODAL,
        });
    });
});
