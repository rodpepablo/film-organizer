import { describe, it, expect } from "vitest";
import { uiMenuStateSelector } from "../../../src/infra/selectors/ui";

describe("UI selectors", () => {
    it("uiMenuSelectorShould get menu status from state", () => {
        const state = {
            ui: {
                "other-menu": true,
                "custom-menu": false,
            },
        };

        expect(uiMenuStateSelector("custom-menu", state)).toBeFalsy();

        state.ui["custom-menu"] = true;

        expect(uiMenuStateSelector("custom-menu", state)).toBeTruthy();
    });
});
