import { describe, it, expect } from "vitest";
import { CollectionValidators } from "../../../src/domain/validators/collection";
import { INVALID_COLLECTION_NAME } from "../../../src/infra/errors";

describe("Collection validators", () => {
    describe("collection creation", () => {
        it.each(["", "asdfgasdfgasdfgasdfgasdfga"])(
            "%s should be invalid",
            (value) => {
                const [isValid, error] = CollectionValidators.collectionCreation.validate({
                    name: value,
                });

                expect(isValid).toBeFalsy();
                expect(error.msg).toEqual(INVALID_COLLECTION_NAME);
            },
        );

        it("should be valid otherwise", () => {
            const [isValid, error] = CollectionValidators.collectionCreation.validate({
                name: "valid name",
            });

            expect(isValid).toBeTruthy();
            expect(error).toBeNull();
        });
    });
});
