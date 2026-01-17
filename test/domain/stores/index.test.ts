import { describe, it, expect, vi } from "vitest";
import { registerStores } from "../../../src/domain/stores";
import { uiStore } from "../../../src/domain/stores/ui";

describe("Register stores", () => {
    it("should add all the stores to the app", () => {
        const app = { use: vi.fn() };
        registerStores(app);

        expect(app.use).toHaveBeenCalledTimes(1);
        expect(app.use).toHaveBeenCalledWith(uiStore);
    });
});
