import { describe, expect, it } from "vitest";
import { State } from "../../../../src/domain/models/state";
import Nav from "../../../../src/ui/components/nav/nav/nav";
import { items } from "../../../../src/ui/components/nav/nav/nav-menu-items";
import { aCollection } from "../../../test-util/fixtures";

const COLLECTION = aCollection();

describe("Nav", () => {
    it("Should contain menus and items", () => {
        const nav = Nav({ menus: {}, collection: COLLECTION } as State, () => { });

        const menus = Array.from(nav.querySelectorAll(".nav-menu-title")).map(
            (x) => x.innerHTML,
        );
        const foundItems = Array.from(nav.querySelectorAll(".nav-menu-item")).map(
            (x) => x.innerHTML,
        );

        expect(menus).toHaveLength(2);
        expect(menus).toContain("Collection Management");
        expect(menus).toContain("Film Management");

        const itemList = Object.values(items);
        expect(foundItems).toHaveLength(itemList.length);
        for (let item of itemList) {
            expect(foundItems).toContain(item.title);
        }
    });

    it("Should only show collection management menu when no menu loaded", () => {
        const nav = Nav({ menus: {}, collection: null } as State, () => { });

        const menus = Array.from(nav.querySelectorAll(".nav-menu-title")).map(
            (x) => x.innerHTML,
        );

        expect(menus).toHaveLength(1);
        expect(menus).toContain("Collection Management");
    });
});
