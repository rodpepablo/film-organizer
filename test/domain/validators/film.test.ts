import { describe, it, expect } from "vitest";
import { FilmValidators } from "../../../src/domain/validators/film";
import { INVALID_FILM_NAME, INVALID_SHOT_ISO } from "../../../src/infra/errors";
import { aFilmInfo } from "../../test-util/fixtures";

describe("Film validators", () => {
    describe("edit film name", () => {
        it("should be invalid if empty", () => {
            const [isValid, error] = FilmValidators.filmNameEdit.validate({
                name: "",
            });

            expect(isValid).toBeFalsy();
            expect(error.msg).toEqual(INVALID_FILM_NAME);
        });

        it("should be valid if not empty", () => {
            const [isValid, error] = FilmValidators.filmNameEdit.validate({
                name: "film name",
            });

            expect(isValid).toBeTruthy();
            expect(error).toBeNull();
        });
    });

    describe("film info edit", () => {
        it("Should be invalid if shotISO is not a number", () => {
            const [isValid, error] = FilmValidators.filmInfoEdit.validate({
                ...aFilmInfo({ shotISO: "NaN" }),
                filmId: "123",
            });

            expect(isValid).toBeFalsy();
            expect(error).toEqual({ msg: INVALID_SHOT_ISO });
        });

        it("Should be valid if fields are empty", () => {
            const [isValid, error] = FilmValidators.filmInfoEdit.validate({
                camera: "",
                lens: "",
                filmStock: "",
                shotISO: "",
                filmStockExpiration: "",
                filmId: "123",
            });

            expect(isValid).toBeTruthy();
            expect(error).toBeNull();
        });

        it("Should be valid", () => {
            const [isValid, error] = FilmValidators.filmInfoEdit.validate({
                ...aFilmInfo(),
                filmId: "123",
            });

            expect(isValid).toBeTruthy();
            expect(error).toBeNull();
        });
    });
});
