import { describe, it, expect, vi } from "vitest";
import Nanobus from "nanobus";
import { uiStore } from "../../../src/domain/stores/ui";
import { TOGGLE_NAV_MENU } from "../../../src/infra/events";

describe("UI Store", () => {
    it.each([true, false])(
        "should change menu status on event for %s",
        (initial) => {
            const bus = new Nanobus();
            vi.spyOn(bus, "emit");
            const state = {
                menus: {
                    "custom-menu": initial,
                },
            };
            uiStore(state, bus);
            bus.emit(TOGGLE_NAV_MENU, { menu: "custom-menu" });

            expect(bus.emit).toHaveBeenCalledWith("render");
            expect(state.menus["custom-menu"]).toEqual(!initial);
        },
    );
});
