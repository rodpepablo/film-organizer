import { describe, expect, it } from "vitest";
import OptionsInput from "../../../../../../src/renderer/src/ui/components/general/input/options-input";
import { State } from "../../../../../../src/domain/models/state";
import {
    safeDispatchEvent,
    safeDispatchKeyboardEvent,
} from "../../../../../test-util/dom";
import {
    KEY_DOWN,
    KEY_ENTER,
    KEY_UP,
} from "../../../../../../src/infra/constants";

const OPTIONS = [
    { id: "1", value: "value1" },
    { id: "2", value: "value2" },
    { id: "3", value: "value3" },
    { id: "4", value: "other" },
];

describe("Options Input Component", () => {
    it("Input to be filled with value", () => {
        const input = new OptionsInput({
            name: "test",
            label: "label",
            options: [{ id: "3", value: "value3" }],
        });

        input.setValue("value1");
        expect(
            input.render({} as State, () => { }).querySelector("input")!.value,
        ).toEqual("value1");

        input.setValue({ id: "1", value: "value2" });
        expect(
            input.render({} as State, () => { }).querySelector("input")!.value,
        ).toEqual("value2");

        input.setValue({ id: "3" });
        expect(
            input.render({} as State, () => { }).querySelector("input")!.value,
        ).toEqual("value3");
    });

    it("On focus the options should be visible", () => {
        const input = anInputWithOptions();
        const dom = input.render({} as State, () => { });

        expect(
            dom.querySelector(".input-options")?.hasAttribute("hidden"),
        ).toBeTruthy();

        safeDispatchEvent(dom.querySelector<HTMLInputElement>("input")!, "focus");

        expect(
            dom.querySelector(".input-options")?.hasAttribute("hidden"),
        ).toBeFalsy();
    });

    it("On blur the options should be hidden", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input, inputOptions } = getFromDom(dom);

        safeDispatchEvent(input, "focus");
        expect(inputOptions.hasAttribute("hidden")).toBeFalsy();
        safeDispatchEvent(input, "blur");
        expect(inputOptions.hasAttribute("hidden")).toBeTruthy();
    });

    it("On input the options should be filtered", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input, inputOptions } = getFromDom(dom);

        input.value = "o"; // Only selecting the one with value "other"
        safeDispatchEvent(input, "input");

        const optionItems = inputOptions.querySelectorAll<HTMLElement>("li");
        expect(optionItems).toHaveLength(1);
    });

    it("On input change if no options satisfy the filter the option box should be hidden", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input, inputOptions } = getFromDom(dom);

        safeDispatchEvent(input, "focus");
        expect(inputOptions.hasAttribute("hidden")).toBeFalsy();

        input.value = "wrong";
        safeDispatchEvent(input, "input");
        expect(inputOptions.hasAttribute("hidden")).toBeTruthy();
    });

    it("On arrow up previous item in options should be targeted", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input, inputOptions } = getFromDom(dom);

        safeDispatchEvent(input, "focus");
        safeDispatchKeyboardEvent(input, KEY_UP);

        expect(inputOptions.hasAttribute("hidden")).toBeFalsy();
        expect(optionsTargeted(inputOptions)).toEqual([false, false, false, true]);

        safeDispatchKeyboardEvent(input, KEY_UP);
        expect(optionsTargeted(inputOptions)).toEqual([false, false, true, false]);

        safeDispatchKeyboardEvent(input, KEY_UP);
        expect(optionsTargeted(inputOptions)).toEqual([false, true, false, false]);

        safeDispatchKeyboardEvent(input, KEY_UP);
        expect(optionsTargeted(inputOptions)).toEqual([true, false, false, false]);

        safeDispatchKeyboardEvent(input, KEY_UP);
        expect(optionsTargeted(inputOptions)).toEqual([false, false, false, true]);
    });

    it("On arrow down next item in options should be targeted", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input, inputOptions } = getFromDom(dom);

        safeDispatchEvent(input, "focus");
        safeDispatchKeyboardEvent(input, KEY_DOWN);

        expect(inputOptions.hasAttribute("hidden")).toBeFalsy();
        expect(optionsTargeted(inputOptions)).toEqual([true, false, false, false]);

        safeDispatchKeyboardEvent(input, KEY_DOWN);
        expect(optionsTargeted(inputOptions)).toEqual([false, true, false, false]);

        safeDispatchKeyboardEvent(input, KEY_DOWN);
        expect(optionsTargeted(inputOptions)).toEqual([false, false, true, false]);

        safeDispatchKeyboardEvent(input, KEY_DOWN);
        expect(optionsTargeted(inputOptions)).toEqual([false, false, false, true]);

        safeDispatchKeyboardEvent(input, KEY_DOWN);
        expect(optionsTargeted(inputOptions)).toEqual([true, false, false, false]);
    });

    it("On enter, targeted option should be selected", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input } = getFromDom(dom);

        safeDispatchEvent(input, "focus");
        safeDispatchKeyboardEvent(input, KEY_DOWN);
        safeDispatchKeyboardEvent(input, KEY_DOWN);
        safeDispatchKeyboardEvent(input, KEY_ENTER);

        expect(input.value).toEqual(OPTIONS[1].value);
    });

    it("On enter, if options are not opened targeted element is not used", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input, inputOptions } = getFromDom(dom);

        inputOptions.children[0].setAttribute("targeted", "");
        input.value = "previous";
        safeDispatchEvent(input, "input");
        safeDispatchKeyboardEvent(input, KEY_ENTER);
        expect(input.value).toEqual("previous");
    });

    it("When clicking on an option its value should be selected", () => {
        const optionsInput = anInputWithOptions();
        const dom = optionsInput.render({} as State, () => { });
        const { input, inputOptions } = getFromDom(dom);

        safeDispatchEvent(input, "focus");
        safeDispatchEvent(
            inputOptions.querySelectorAll<HTMLElement>("li")[1],
            "mousedown",
        );
        expect(input.value).toEqual(OPTIONS[1].value);
    });
});

function anInputWithOptions() {
    return new OptionsInput({
        name: "test",
        label: "label",
        options: OPTIONS,
    });
}

function getFromDom(dom: HTMLElement) {
    const input = dom.querySelector<HTMLInputElement>("input")!;
    const inputOptions = dom.querySelector<HTMLElement>(".input-options")!;
    return { input, inputOptions };
}

function optionsTargeted(inputOptions: HTMLElement): boolean[] {
    return Array.from(inputOptions.querySelectorAll<HTMLElement>("li")).map(
        (el) => el.hasAttribute("targeted"),
    );
}
