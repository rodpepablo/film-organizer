import { describe, it, expect } from "vitest";
import {
    uiFormErrorSelector,
    uiMenuStateSelector,
    uiModalSelector,
} from "../../../src/infra/selectors/ui";

describe("UI selectors", () => {
    it("uiMenuSelector should get menu status from state", () => {
        const state = {
            menus: {
                "other-menu": true,
                "custom-menu": false,
            },
        };

        expect(uiMenuStateSelector("custom-menu", state)).toBeFalsy();

        state.menus["custom-menu"] = true;

        expect(uiMenuStateSelector("custom-menu", state)).toBeTruthy();
    });

    it("uiModalSelector should get modal info", () => {
        const state = {
            modal: {
                active: true,
                modalId: "custom-modal",
            },
        };

        expect(uiModalSelector(state)).toStrictEqual({
            active: true,
            modalId: "custom-modal",
        });
    });

    it("uiFormErrorSelector should get the error for a form", () => {
        const state = {
            forms: {
                someform: {
                    error: "CUSTOM ERROR",
                },
            },
        };

        expect(uiFormErrorSelector(state, "someform")).toEqual("CUSTOM ERROR");
    });
});
