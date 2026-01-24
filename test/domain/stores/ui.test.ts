import { describe, it, expect } from "vitest";
import { uiStore } from "../../../src/domain/stores/ui";
import {
    CLEAR_FORM,
    CLOSE_MODAL,
    FORM_ERROR,
    OPEN_MODAL,
    TOGGLE_NAV_MENU,
} from "../../../src/infra/events";
import { CREATE_ALBUM_FORM } from "../../../src/infra/constants";
import { expectRender, spiedBus } from "../../test-util/mocking";

const BASE_STATE = {
    menus: {},
    modal: { active: false, modalId: null },
    forms: {},
};

const ERROR_MSG = "ERROR";

describe("UI Store", () => {
    it.each([true, false])(
        "should change menu status on event for %s",
        (initial) => {
            const bus = spiedBus();

            const state = {
                ...BASE_STATE,
                menus: {
                    "custom-menu": initial,
                },
            };

            uiStore(state, bus);
            bus.emit(TOGGLE_NAV_MENU, { menu: "custom-menu" });

            expectRender(bus);
            expect(state.menus["custom-menu"]).toEqual(!initial);
        },
    );

    it("should open modal for an specific modal id", () => {
        const bus = spiedBus();

        const state = {
            ...BASE_STATE,
            modal: {
                active: false,
                modalId: null,
            },
        };

        uiStore(state, bus);
        bus.emit(OPEN_MODAL, { modalId: "custom-modal" });

        expectRender(bus);
        expect(state.modal.active).toBeTruthy();
        expect(state.modal.modalId).toEqual("custom-modal");
    });

    it("should close modal", () => {
        const bus = spiedBus();

        const state = {
            ...BASE_STATE,
            modal: {
                active: true,
                modalId: "custom-modal",
            },
        };

        uiStore(state, bus);
        bus.emit(CLOSE_MODAL);

        expectRender(bus);
        expect(state.modal.active).toBeFalsy();
        expect(state.modal.modalId).toBeNull();
    });

    it("Should put an error into a form", () => {
        const bus = spiedBus();
        const state = BASE_STATE;

        uiStore(state, bus);

        bus.emit(FORM_ERROR, { form: CREATE_ALBUM_FORM, error: ERROR_MSG });
        expect(state.forms[CREATE_ALBUM_FORM].error).toEqual(ERROR_MSG);
        expectRender(bus);
    });

    it("Should modify an error in a form", () => {
        const bus = spiedBus();
        const state = {
            ...BASE_STATE,
            forms: {
                [CREATE_ALBUM_FORM]: {
                    error: null,
                },
            },
        };

        uiStore(state, bus);

        bus.emit(FORM_ERROR, { form: CREATE_ALBUM_FORM, error: ERROR_MSG });
        expect(state.forms[CREATE_ALBUM_FORM].error).toEqual(ERROR_MSG);
        expectRender(bus);
    });

    it("Should clear an error in a form", () => {
        const bus = spiedBus();
        const state = {
            ...BASE_STATE,
            forms: {
                [CREATE_ALBUM_FORM]: {
                    error: ERROR_MSG,
                },
            },
        };

        uiStore(state, bus);

        bus.emit(CLEAR_FORM, { form: CREATE_ALBUM_FORM });
        expect(state.forms[CREATE_ALBUM_FORM].error).toBeNull();
        expectRender(bus);
    });
});
