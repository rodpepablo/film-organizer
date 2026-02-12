import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { UPDATE_FORM } from "../../../../src/infra/events";
import Button from "../../../../src/ui/components/general/button/button";
import Form from "../../../../src/ui/components/general/form/form";
import Input from "../../../../src/ui/components/general/input/input";
import { setInputValueTo, submitForm } from "../../../test-util/dom";
import { aForm } from "../../../test-util/fixtures";

const STATE = { forms: {} } as State;

describe("Form Component", () => {
    it("Should inject the content into the form", () => {
        const config = { formId: "", submitEvent: "", inputs: [anInput("album")] };
        const form = new Form(config);
        const dom = form.render(STATE, () => { });
        const input = dom.querySelector('input[name="album"]');

        expect(input).not.toBeNull();
    });

    it("Should show error if exists", () => {
        const config = {
            formId: "FORM",
            submitEvent: "",
            inputs: [anInput("album")],
        };
        const form = new Form(config);
        const state = {
            forms: {
                FORM: aForm({ error: "ERROR" }),
            },
        };
        const dom = form.render(state as unknown as State, vi.fn());

        expect(dom.querySelector(".form-error")?.innerHTML).toEqual("ERROR");
    });

    it("Shouldn't show and error when there is none", () => {
        const config = {
            formId: "FORM",
            submitEvent: "",
            inputs: [anInput("album")],
        };
        const form = new Form(config);
        const state = { forms: {} } as State;
        const dom = form.render(state, vi.fn());

        expect(dom.querySelector(".form-error")).toBeNull();
    });

    it("Should emit a form update with form values on change", () => {
        const emit = vi.fn();
        const config = {
            formId: "123",
            submitEvent: "",
            inputs: [anInput("album"), anInput("film")],
        };
        const form = new Form(config);
        const dom = form.render(STATE, emit);

        setInputValueTo(dom, "album", "ALBUM");

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            formId: "123",
            values: {
                album: "ALBUM",
                film: "",
            },
        });

        setInputValueTo(dom, "film", "FILM");

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            formId: "123",
            values: {
                album: "ALBUM",
                film: "FILM",
            },
        });
    });

    it("Should emit an update and a submit with the provided submitEvent", () => {
        const emit = vi.fn();
        const config = {
            formId: "123",
            submitEvent: "EVENT",
            inputs: [anInput("album")],
        };
        const form = new Form(config);
        const dom = form.render(STATE, emit);

        setInputValueTo(dom, "album", "ALBUM");
        submitForm(dom);

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            formId: "123",
            values: { album: "ALBUM" },
        });
        expect(emit).toHaveBeenCalledWith("EVENT");
    });

    it("Should set values to inputs from state before rendering them", () => {
        const config = {
            formId: "FORM",
            submitEvent: "EVENT",
            inputs: [anInput("album")],
        };
        const state = {
            forms: {
                FORM: aForm({ values: { album: "ALBUM_VALUE" } }),
            },
        } as unknown as State;
        const form = new Form(config);

        const dom = form.render(state, () => { });

        expect(dom.querySelector<HTMLInputElement>("input")?.value).toEqual(
            "ALBUM_VALUE",
        );
    });

    it("Should admit a button as configuration", () => {
        const config = {
            formId: "123",
            submitEvent: "EVENT",
            inputs: [],
            button: new Button({ input: "button", value: "TEST_BUTTON" }),
        };
        const form = new Form(config);

        const dom = form.render(STATE, () => { });

        const button = dom.querySelector<HTMLButtonElement>("button");
        expect(button?.innerHTML).toEqual("TEST_BUTTON");
    });

    it("Should put a submit button if no button configured", () => {
        const config = {
            formId: "123",
            submitEvent: "EVENT",
            inputs: [],
        };
        const form = new Form(config);

        const dom = form.render(STATE, () => { });

        const button = dom.querySelector("button");
        expect(button).not.toBeNull();
    });
});

function anInput(name: string): Input {
    return new Input({ name, label: name });
}
