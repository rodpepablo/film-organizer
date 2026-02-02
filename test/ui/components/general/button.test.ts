import { describe, it, expect, vi } from "vitest";
import button from "../../../../src/ui/components/general/button/button";

describe("Button Component", () => {
    it("should configure the value", () => {
        expect(button({ value: "send" }).innerHTML).toEqual("send");
    });

    it("should configure the button input", () => {
        expect(
            button({ value: "send", input: "submit" }).getAttribute("type"),
        ).toEqual("submit");
        expect(button({ value: "send" }).getAttribute("type")).toEqual("button");
    });

    it("should configure styles", () => {
        expect(
            button({ value: "send", type: "tiny" }).getAttribute("class"),
        ).toEqual("tiny button");
    });

    it("should configure onclick handler", () => {
        const mock = vi.fn();

        button({ value: "send", onclick: mock }).click();

        expect(mock).toHaveBeenCalled();
    });
});
