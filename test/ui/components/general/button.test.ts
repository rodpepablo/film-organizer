import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import Button from "../../../../src/ui/components/general/button/button";

describe("Button Component", () => {
    it("should configure the value", () => {
        const button = new Button({ value: "send" });

        expect(button.render({} as State, () => { }).innerHTML).toEqual("send");
    });

    it("should configure the button input", () => {
        const submit = new Button({ value: "send", input: "submit" });
        const button = new Button({ value: "send", input: "button" });

        expect(submit.render({} as State, () => { }).getAttribute("type")).toEqual(
            "submit",
        );
        expect(button.render({} as State, () => { }).getAttribute("type")).toEqual(
            "button",
        );
    });

    it("should configure styles", () => {
        const button = new Button({ value: "send", type: "tiny" });
        expect(button.render({} as State, () => { }).getAttribute("class")).toEqual(
            "tiny button",
        );
    });

    it("should configure onclick handler", () => {
        const mock = vi.fn();
        const button = new Button({ value: "send", onclick: mock });

        button.render({} as State, () => { }).click();

        expect(mock).toHaveBeenCalled();
    });
});
