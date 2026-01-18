import { describe, it, expect } from "vitest";
import { State } from "../../../src/domain/models/state";
import {
    ALBUM_MANAGEMENT_MENU,
    FILM_MANAGEMENT_MENU,
} from "../../../src/infra/constants";
import createInitialState from "../../../src/domain/stores/initial-state";

describe("Create initial state", () => {
    it("Should initialize ui elements", () => {
        const state = {} as State;
        createInitialState(state);
        expect(state.menus).toStrictEqual({
            [ALBUM_MANAGEMENT_MENU]: false,
            [FILM_MANAGEMENT_MENU]: false,
        });
    });

    it("Should initialize album", () => {
        const state = {} as State;
        createInitialState(state);
        expect(state.album).toStrictEqual(null);
    });
});
