import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import DropDown from "../../../../src/ui/components/general/drop-down-menu/drop-down-menu";
import DropDownItem from "../../../../src/ui/components/general/drop-down-menu/drop-down-menu-item";
import { safeDispatchEvent } from "../../../test-util/dom";

describe("Drop Down Component", () => {
    it("Should be closed by default and set button label", () => {
        const dropdown = new DropDown({ label: "NEW DROP DOWN", items: [] });

        const dom = dropdown.render({} as State, () => { });

        expect(
            dom.querySelector<HTMLElement>(".drop-down-button")?.innerHTML,
        ).toEqual(
            '<iconify-icon icon="mdi:chevron-down"></iconify-icon>NEW DROP DOWN',
        );
        expect(
            dom.querySelector<HTMLElement>(".drop-down-list")?.hidden,
        ).toBeTruthy();
    });

    it("Should open when clicking on menu button", () => {
        const dropdown = new DropDown({ label: "lable", items: [] });

        const dom = dropdown.render({} as State, () => { });
        dom.querySelector<HTMLElement>(".drop-down-button")?.click();

        expect(
            dom.querySelector<HTMLElement>(".drop-down-list")?.hidden,
        ).toBeFalsy();
    });

    it("Should execute item onclick and close menu when clicking on an item", () => {
        const mock = vi.fn();
        const dropdown = new DropDown({
            label: "label",
            items: [new DropDownItem({ label: "item", onClick: mock })],
        });

        const dom = dropdown.render({} as State, () => { });
        dom.querySelector<HTMLElement>(".drop-down-button")?.click();
        safeDispatchEvent(
            dom.querySelector<HTMLElement>(".drop-down-item")!,
            "mousedown",
        );
        safeDispatchEvent(
            dom.querySelector<HTMLElement>(".drop-down-button")!,
            "blur",
        );

        expect(mock).toHaveBeenCalledOnce();
        expect(
            dom.querySelector<HTMLElement>(".drop-down-list")?.hidden,
        ).toBeTruthy();
    });
});
