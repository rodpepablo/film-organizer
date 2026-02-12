import { describe, it, expect } from "vitest";
import { FilmValidators } from "../../../src/domain/validators/film";
import { INVALID_FILM_NAME } from "../../../src/infra/errors";

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
});
