import { describe, expect, it } from "vitest";
import { State } from "../../../../src/domain/models/state";
import Nav from "../../../../src/ui/components/nav/nav/nav";

describe("Nav", () => {
    it("Should contain menus and items", () => {
        const nav = Nav({ menus: {} } as State, () => { });

        const menus = Array.from(nav.querySelectorAll(".nav-menu-title")).map(
            (x) => x.innerHTML,
        );
        const items = Array.from(nav.querySelectorAll(".nav-menu-item")).map(
            (x) => x.innerHTML,
        );

        expect(menus).toHaveLength(2);
        expect(menus).toContain("Album Management");
        expect(menus).toContain("Film Management");

        expect(items).toHaveLength(2);
        expect(items).toContain("Create Album");
        expect(items).toContain("Load Album");
    });
});
