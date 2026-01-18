import { describe, it, expect } from "vitest";
import { uiStore } from "../../../src/domain/stores/ui";
import {
    CLOSE_MODAL,
    OPEN_MODAL,
    TOGGLE_NAV_MENU,
} from "../../../src/infra/events";
import { expectRender, spiedBus } from "../../test-util/mocking";

const BASE_STATE = {
    menus: {},
    modal: { active: false, modalId: null },
};

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
});
