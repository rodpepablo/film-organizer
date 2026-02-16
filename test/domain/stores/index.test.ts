import { describe, it, expect, vi } from "vitest";
import { registerStores } from "../../../src/domain/stores";
import { albumStore } from "../../../src/domain/stores/album";
import { filmStore } from "../../../src/domain/stores/film";
import { filmImageStore } from "../../../src/domain/stores/film-image";
import { uiStore } from "../../../src/domain/stores/ui";

describe("Register stores", () => {
    it("should add all the stores to the app", () => {
        const app = { use: vi.fn() };
        registerStores(app);

        const stores = [uiStore, albumStore, filmStore, filmImageStore];
        expect(app.use).toHaveBeenCalledTimes(stores.length);
        for (let store of stores) {
            expect(app.use).toHaveBeenCalledWith(store);
        }
    });
});
