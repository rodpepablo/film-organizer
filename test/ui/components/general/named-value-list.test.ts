import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import NamedValueList from "../../../../src/ui/components/general/named-value-list/named-value-list";

describe("NamedValueList Component", () => {
    it("Should show all the items passed in the constructor", () => {
        const items = [
            { name: "Camera", value: "Canon" },
            { name: "Lens", value: "50mm" },
        ];

        const dom = new NamedValueList(items).render({} as State, () => { });
        const listItems = Array.from(
            dom.querySelectorAll<HTMLElement>(".named-value-item"),
        ).map((item) => item.innerHTML);

        expect(listItems).toHaveLength(items.length);
        for (let item of items) {
            expect(listItems).toContain(`<b>${item.name}:</b>${item.value}`);
        }
    });
});
