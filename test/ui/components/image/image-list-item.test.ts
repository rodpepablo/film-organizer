import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import ImageListItem from "../../../../src/ui/components/image/image-list-item/image-list-item";
import { anImage } from "../../../test-util/fixtures";

const IMAGE = anImage({ path: "/to/image.jpg" });

describe("ImageListItem Component", () => {
    it("should update image path to use safe-file protocol", () => {
        const imageListItem = new ImageListItem(IMAGE);

        const dom = imageListItem.render({} as State, () => { });

        expect(
            dom.querySelector(".image-list-item-preview")?.getAttribute("src"),
        ).toEqual("safe-file:///to/image.jpg");
    });

    it("should show image info", () => {
        const imageListItem = new ImageListItem(IMAGE);

        const dom = imageListItem.render({} as State, () => { });

        expect(dom.querySelector(".image-list-item-name")?.innerHTML).toEqual(
            IMAGE.name,
        );
        expect(dom.querySelector(".image-list-item-ext")?.innerHTML).toEqual(
            `(${IMAGE.ext})`,
        );
    });

    it("should add data-id with the image id for sortable", () => {
        const imageListItem = new ImageListItem(IMAGE);

        const dom = imageListItem.render({} as State, () => { });

        expect(dom.getAttribute("data-id")).toEqual(IMAGE.id);
    });
});
