import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import Input from "../../../../src/ui/components/general/input/input";

describe("Input Component", () => {
    it("Should update fields in input element", () => {
        const input = new Input({ name: "NAME", label: "LABEL" });
        input.setValue("VALUE");

        const dom = input.render({} as State, () => { });

        const domInput = dom.querySelector<HTMLInputElement>("input");
        const label = dom.querySelector<HTMLElement>("label");
        expect(domInput?.getAttribute("type")).toEqual("text");
        expect(domInput?.getAttribute("name")).toEqual("NAME");
        expect(domInput?.value).toEqual("VALUE");
        expect(label?.innerHTML).toEqual("LABEL:");
    });
});
