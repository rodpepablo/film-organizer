import { describe, it, expect, vi } from "vitest";
import { registerStores } from "../../../../src/renderer/src/stores";
import { collectionStore } from "../../../../src/renderer/src/stores/collection";
import { filmStore } from "../../../../src/renderer/src/stores/film";
import { filmImageStore } from "../../../../src/renderer/src/stores/film-image";
import { uiStore } from "../../../../src/renderer/src/stores/ui";

describe("Register stores", () => {
    it("should add all the stores to the app", () => {
        const app = { use: vi.fn() };
        registerStores(app);

        const stores = [uiStore, collectionStore, filmStore, filmImageStore];
        expect(app.use).toHaveBeenCalledTimes(stores.length);
        for (let store of stores) {
            expect(app.use).toHaveBeenCalledWith(store);
        }
    });
});
