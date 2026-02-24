import { describe, it, expect } from "vitest";
import { ImageValidators } from "../../../src/domain/validators/film-image";
import {
    INVALID_DUPLICATED_IMAGE_NAME,
    INVALID_IMAGE_NAME,
} from "../../../src/infra/errors";
import { aFilm, aCollection, anImage } from "../../test-util/fixtures";

const IMAGE_1 = anImage({ name: "image1" });
const IMAGE_2 = anImage({ name: "image2" });

describe("IMAGE validators", () => {
    describe("edit image name", () => {
        it("should be invalid if empty", () => {
            const film = aFilm({ images: [IMAGE_1] });
            const collection = aCollection({ films: [film] });
            const [isValid, error] = ImageValidators.filmNameEdit
                .withContext(collection)
                .validate({
                    name: "",
                    filmId: film.id,
                    imageId: IMAGE_1.id,
                });

            expect(isValid).toBeFalsy();
            expect(error.msg).toEqual(INVALID_IMAGE_NAME);
        });

        it("should be invalid if name already chosen by another image", () => {
            const film = aFilm({ images: [IMAGE_1, IMAGE_2] });
            const collection = aCollection({ films: [film] });

            const [isValid, error] = ImageValidators.filmNameEdit
                .withContext(collection)
                .validate({
                    name: IMAGE_2.name,
                    filmId: film.id,
                    imageId: IMAGE_1.id,
                });

            expect(isValid).toBeFalsy();
            expect(error.msg).toEqual(INVALID_DUPLICATED_IMAGE_NAME);
        });

        it("should be valid if not empty", () => {
            const film = aFilm({ images: [IMAGE_1, IMAGE_2] });
            const collection = aCollection({ films: [film] });
            const [isValid, error] = ImageValidators.filmNameEdit
                .withContext(collection)
                .validate({
                    name: "film name",
                    filmId: film.id,
                    imageId: IMAGE_1.id,
                });

            expect(isValid).toBeTruthy();
            expect(error).toBeNull();
        });
    });
});
