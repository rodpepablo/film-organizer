import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../../../src/domain/models/state";
import { CREATE_IMAGE_PREVIEW_REQUEST } from "../../../../../../src/infra/events";
import ImageComponent from "../../../../../../src/renderer/src/ui/components/image/image/image";
import { anImage } from "../../../../../test-util/fixtures";

describe("ImageListItem Component", () => {
    it("should update image path to use safe-file protocol and update date", () => {
        const image = anImage({ path: "/to/image.jpg", lastUpdated: "last_date" });
        const imageComponent = new ImageComponent(image);

        const dom = imageComponent.render({} as State, () => { });

        expect(dom.getAttribute("src")).toEqual(
            "safe-file:///to/image.jpg?v=last_date",
        );
    });

    it("if image format needs convertion and preview path is defined, use it", () => {
        const image = anImage({
            path: "/path.tif",
            previewPath: "/preview.jpg",
            ext: "tif",
        });
        const imageComponent = new ImageComponent(image);

        const dom = imageComponent.render({} as State, () => { });

        expect(dom.getAttribute("src")).toEqual("safe-file:///preview.jpg");
    });

    it("if image format needs convertion and not preview define emit event and show loading", () => {
        const image = anImage({
            path: "/path.tif",
            ext: "tif",
            previewPath: null,
        });
        const imageComponent = new ImageComponent(image);
        const emit = vi.fn();

        const dom = imageComponent.render({} as State, emit);

        expect(emit).toHaveBeenCalledWith(CREATE_IMAGE_PREVIEW_REQUEST, {
            imageId: image.id,
        });
        expect(dom.className).toEqual("image-loading");
    });

    it("if image needs convertion, no preview but already loading, show loading but dont emit", () => {
        const image = anImage({
            path: "/path.tif",
            ext: "tif",
            previewPath: null,
            loading: true,
        });
        const imageComponent = new ImageComponent(image);
        const emit = vi.fn();

        const dom = imageComponent.render({} as State, emit);

        expect(emit).not.toHaveBeenCalled();
        expect(dom.className).toEqual("image-loading");
    });
});
