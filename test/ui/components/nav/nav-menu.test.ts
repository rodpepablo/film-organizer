import { describe, it, expect, vi } from "vitest";
import NavMenu from "../../../../src/ui/components/nav/nav-menu/nav-menu";
import { TOGGLE_NAV_MENU } from "../../../../src/infra/events";

const TITLE = "custom title";
const MENU_ID = "custom-menu";
const STATE = {
    menus: {
        "custom-menu": false,
    },
};

describe("NavMenu", () => {
    it("Should show the title", () => {
        const navMenu = new NavMenu(TITLE, MENU_ID);

        const dom = navMenu.render(STATE, vi.fn());

        expect(dom.querySelector(".nav-menu-title")?.innerHTML).toBe(TITLE);
    });

    it.each(["open", "closed"])(
        "Menu should be %s depeding on state",
        (status) => {
            const navMenu = new NavMenu(TITLE, MENU_ID);
            const state = {
                menus: {
                    "custom-menu": status === "open" ? true : false,
                },
            };

            const dom = navMenu.render(state, vi.fn());

            expect(
                dom.querySelector(".nav-menu-elements")?.hasAttribute("hidden"),
            ).toBe(status === "open" ? false : true);
        },
    );

    it("Should fire a toggle event when clicking the menu title", () => {
        const navMenu = new NavMenu(TITLE, MENU_ID);
        const emit = vi.fn();

        const dom = navMenu.render(STATE, emit);
        dom.querySelector<HTMLElement>(".nav-menu-title")?.click();

        expect(emit).toHaveBeenCalledOnce();
        expect(emit).toHaveBeenCalledWith(TOGGLE_NAV_MENU, { menu: MENU_ID });
    });
});
