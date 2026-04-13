import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import {
    COLLECTION_MANAGEMENT_MENU,
    FILM_MANAGEMENT_MENU,
    HOME_SECTION,
} from "../../../../src/infra/constants";
import createInitialState from "../../../../src/renderer/src/stores/initial-state";

describe("Create initial state", () => {
    it("Should initialize location", () => {
        const state = {} as State;

        createInitialState(state);

        expect(state.location).toEqual([HOME_SECTION]);
    });

    it("Should initialize menus elements", () => {
        const state = {} as State;

        createInitialState(state);

        expect(state.menus).toStrictEqual({
            [COLLECTION_MANAGEMENT_MENU]: true,
            [FILM_MANAGEMENT_MENU]: true,
        });
    });

    it("Should initialize modal", () => {
        const state = {} as State;

        createInitialState(state);

        expect(state.modal).toStrictEqual({
            active: false,
            modalId: null,
        });
    });

    it("Should initialize forms", () => {
        const state = {} as State;

        createInitialState(state);

        expect(state.forms).toEqual({});
    });

    it("Should initialize notifications", () => {
        const state = {} as State;

        createInitialState(state);

        expect(state.notifications).toEqual([]);
    });

    it("Should initialize collection", () => {
        const state = {} as State;

        createInitialState(state);

        expect(state.collection).toStrictEqual(null);
    });
});
