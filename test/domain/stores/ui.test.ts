import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import Nanobus from "nanobus";
import { uiStore, UIStoreManager } from "../../../src/domain/stores/ui";
import {
    CLEAR_FORM,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    DELETE_NOTIFICATION,
    FORM_ERROR,
    NAVIGATE,
    OPEN_MODAL,
    TOGGLE_NAV_MENU,
} from "../../../src/infra/events";
import { CREATE_ALBUM_FORM } from "../../../src/infra/constants";
import { autoTimeout, expectRender, spiedBus } from "../../test-util/mocking";
import { IIdGenerator } from "../../../src/infra/id-generator";
import { State } from "../../../src/domain/models/state";
import { Notification } from "../../../src/domain/models/ui";
import config from "../../../src/infra/config";

const BASE_STATE = {
    location: [],
    menus: {},
    modal: { active: false, modalId: null },
    forms: {},
    notifications: [],
};
const TIMEOUT_MOCK = () => { };
const DUMB_ID_GENERATOR = mock<IIdGenerator>();
const ERROR_MSG = "ERROR";

describe("UI Store", () => {
    it("should change location on navigate event", () => {
        const bus = spiedBus();
        const state = { ...BASE_STATE };
        const manager = aManagerWith(state, bus);

        manager.navigate({ to: ["album", "123"] });

        expectRender(bus);
        expect(state.location).toEqual(["album", "123"]);
    });

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
            const manager = aManagerWith(state, bus);
            manager.toggleNavmenu({ menu: "custom-menu" });

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

        const manager = aManagerWith(state, bus);
        manager.openModal({ modalId: "custom-modal" });

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

        const manager = aManagerWith(state, bus);
        manager.closeModal();

        expectRender(bus);
        expect(state.modal.active).toBeFalsy();
        expect(state.modal.modalId).toBeNull();
    });

    it("Should put an error into a form", () => {
        const bus = spiedBus();
        const state = BASE_STATE;

        const manager = aManagerWith(state, bus);
        manager.formError({ form: CREATE_ALBUM_FORM, error: ERROR_MSG });

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

        const manager = aManagerWith(state, bus);
        manager.formError({ form: CREATE_ALBUM_FORM, error: ERROR_MSG });

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

        const manager = aManagerWith(state, bus);
        manager.clearForm({ form: CREATE_ALBUM_FORM });

        expect(state.forms[CREATE_ALBUM_FORM].error).toBeNull();
        expectRender(bus);
    });

    it("Should create a notification and schedule its deletion", () => {
        const bus = spiedBus();
        const idGenerator = mock<IIdGenerator>();
        const state = {
            ...BASE_STATE,
            notifications: [],
        };
        idGenerator.generate.mockReturnValue("123");
        const timeout = autoTimeout(expect, config.notifications.ttl);

        const manager = new UIStoreManager(state, bus, idGenerator, timeout);
        manager.createNotification({ type: "success", message: "MESSAGE" });

        expect(state.notifications).toStrictEqual([
            {
                id: "123",
                type: "success",
                message: "MESSAGE",
            },
        ]);
        expect(bus.emit).toHaveBeenCalledWith(DELETE_NOTIFICATION, { id: "123" });
        expectRender(bus);
    });

    it("Should delete a notification by id", () => {
        const bus = spiedBus();
        const toRemove: Notification = {
            id: "123",
            type: "success",
            message: "MSG",
        };
        const otherNotification: Notification = {
            id: "234",
            type: "error",
            message: "other-notification",
        };
        const state = {
            ...BASE_STATE,
            notifications: [toRemove, otherNotification],
        };

        const manager = new UIStoreManager(
            state,
            bus,
            DUMB_ID_GENERATOR,
            TIMEOUT_MOCK,
        );
        manager.deleteNotification({ id: "123" });

        expect(state.notifications).toStrictEqual([otherNotification]);
        expectRender(bus);
    });

    it("Should register handlers", () => {
        const emitter = mock<Nanobus>();

        uiStore(BASE_STATE, emitter);

        const events = [
            NAVIGATE,
            TOGGLE_NAV_MENU,
            OPEN_MODAL,
            CLOSE_MODAL,
            FORM_ERROR,
            CLEAR_FORM,
            CREATE_NOTIFICATION,
            DELETE_NOTIFICATION,
        ];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});

function aManagerWith(
    state: Pick<
        State,
        "location" | "menus" | "modal" | "forms" | "notifications"
    >,
    bus: Nanobus,
) {
    return new UIStoreManager(state, bus, DUMB_ID_GENERATOR, TIMEOUT_MOCK);
}
