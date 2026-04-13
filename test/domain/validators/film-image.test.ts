import { describe, it, expect } from "vitest";
import { ImageValidators } from "../../../src/domain/validators/film-image";
import {
    INVALID_DUPLICATED_IMAGE_NAME,
    INVALID_IMAGE_NAME,
} from "../../../src/infra/errors";
import { aFilm, aCollection, anImage } from "../../test-util/fixtures";
import { UnknownFilmError } from "../../../src/domain/models/errors";

const IMAGE_1 = anImage({ name: "image1" });
const IMAGE_2 = anImage({ name: "image2" });

describe("IMAGE validators", () => {
    describe("edit image name", () => {
        it("should be invalid if empty", () => {
            const film = aFilm({ images: [IMAGE_1] });
            const collection = aCollection({ films: [film] });
            const result = ImageValidators.imageNameEdit
                .withContext(collection)
                .validate({
                    name: "",
                    filmId: film.id,
                    imageId: IMAGE_1.id,
                });

            expect(result).toEqual([false, { msg: INVALID_IMAGE_NAME }]);
        });

        it("should be invalid if name already chosen by another image", () => {
            const film = aFilm({ images: [IMAGE_1, IMAGE_2] });
            const collection = aCollection({ films: [film] });

            const result = ImageValidators.imageNameEdit
                .withContext(collection)
                .validate({
                    name: IMAGE_2.name,
                    filmId: film.id,
                    imageId: IMAGE_1.id,
                });

            expect(result).toEqual([false, { msg: INVALID_DUPLICATED_IMAGE_NAME }]);
        });

        it("Should raise an error if film does not exist", () => {
            const film = aFilm({ images: [IMAGE_1] });
            const collection = aCollection({ films: [film] });

            expect(() =>
                ImageValidators.imageNameEdit.withContext(collection).validate({
                    name: "new_name",
                    filmId: "wrong",
                    imageId: IMAGE_1.id,
                }),
            ).toThrow(UnknownFilmError);
        });

        it("should be valid if not empty", () => {
            const film = aFilm({ images: [IMAGE_1, IMAGE_2] });
            const collection = aCollection({ films: [film] });
            const result = ImageValidators.imageNameEdit
                .withContext(collection)
                .validate({
                    name: "film name",
                    filmId: film.id,
                    imageId: IMAGE_1.id,
                });

            expect(result).toEqual([true, null]);
        });
    });
});
