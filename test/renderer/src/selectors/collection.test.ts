import { describe, it, expect } from "vitest";
import {
    collectionNameSelector,
    collectionSelector,
} from "../../../../src/renderer/src/selectors/collection";
import { aCollection } from "../../../test-util/fixtures";

const COLLECTION = aCollection();

describe("Collection selectors", () => {
    it("collectionSelector should return then collection in the state or null", () => {
        expect(collectionSelector({ collection: null })).toBeNull();
        expect(collectionSelector({ collection: COLLECTION })).toBe(COLLECTION);
    });

    it("collectionNameSelector should return name when collection is loaded", () => {
        const state = { collection: COLLECTION };

        expect(collectionNameSelector(state)).toEqual(COLLECTION.name);
    });

    it("collectionNameSelector should be null when no collection loaded", () => {
        const state = { collection: null };

        expect(collectionNameSelector(state)).toEqual(null);
    });
});
