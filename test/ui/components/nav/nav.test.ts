import { describe, expect, it } from "vitest";
import { State } from "../../../../src/domain/models/state";
import Nav from "../../../../src/ui/components/nav/nav/nav";
import { items } from "../../../../src/ui/components/nav/nav/nav-menu-items";

const ALBUM = { name: "album" };

describe("Nav", () => {
    it("Should contain menus and items", () => {
        const nav = Nav({ menus: {}, album: ALBUM } as State, () => { });

        const menus = Array.from(nav.querySelectorAll(".nav-menu-title")).map(
            (x) => x.innerHTML,
        );
        const foundItems = Array.from(nav.querySelectorAll(".nav-menu-item")).map(
            (x) => x.innerHTML,
        );

        expect(menus).toHaveLength(2);
        expect(menus).toContain("Album Management");
        expect(menus).toContain("Film Management");

        const itemList = Object.values(items);
        expect(foundItems).toHaveLength(itemList.length);
        for (let item of itemList) {
            expect(foundItems).toContain(item.title);
        }
    });

    it("Should only show album management menu when no menu loaded", () => {
        const nav = Nav({ menus: {}, album: null } as State, () => { });

        const menus = Array.from(nav.querySelectorAll(".nav-menu-title")).map(
            (x) => x.innerHTML,
        );

        expect(menus).toHaveLength(1);
        expect(menus).toContain("Album Management");
    });
});
