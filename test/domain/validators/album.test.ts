import { describe, it, expect } from "vitest";
import { AlbumValidators } from "../../../src/domain/validators/album";
import { INVALID_ALBUM_NAME } from "../../../src/infra/errors";

describe("Album validators", () => {
    describe("album creation", () => {
        it.each(["", "asdfgasdfgasdfgasdfgasdfga"])(
            "%s should be invalid",
            (value) => {
                const [isValid, error] = AlbumValidators.albumCreation.validate({
                    name: value,
                });

                expect(isValid).toBeFalsy();
                expect(error.msg).toEqual(INVALID_ALBUM_NAME);
            },
        );

        it("should be valid otherwise", () => {
            const [isValid, error] = AlbumValidators.albumCreation.validate({
                name: "valid name",
            });

            expect(isValid).toBeTruthy();
            expect(error).toBeNull();
        });
    });
});
