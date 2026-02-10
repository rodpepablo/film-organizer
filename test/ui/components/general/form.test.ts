import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { UPDATE_FORM } from "../../../../src/infra/events";
import { html } from "../../../../src/infra/html";
import Form from "../../../../src/ui/components/general/form/form";
import { setInputValueTo, submitForm } from "../../../test-util/dom";
import { aForm } from "../../../test-util/fixtures";

const STATE = { forms: {} } as State;
const CONTENT_WITH_INPUT = html`<input name="album"/>`;

describe("Form Component", () => {
    it("Should inject the content into the form", () => {
        const config = { formId: "", submitEvent: "" };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const dom = form.render(STATE, () => { });
        const input = dom.querySelector('input[name="album"]');

        expect(input).not.toBeNull();
    });

    it("Should show error if exists", () => {
        const config = { formId: "FORM", submitEvent: "" };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const state = {
            forms: {
                FORM: aForm({ error: "ERROR" }),
            },
        };
        const dom = form.render(state, vi.fn());

        expect(dom.querySelector(".form-error")?.innerHTML).toEqual("ERROR");
    });

    it("Shouldn't show and error when there is none", () => {
        const config = { formId: "FORM", submitEvent: "" };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const state = { forms: {} };
        const dom = form.render(state, vi.fn());

        expect(dom.querySelector(".form-error")).toBeNull();
    });

    it("Should emit a form update with form values on change", () => {
        const emit = vi.fn();
        const config = { formId: "123", submitEvent: "" };
        const content = html`<input name="album"/><input name="film"/>`;
        const form = new Form(config, content);
        const dom = form.render(STATE, emit);

        setInputValueTo(dom, "album", "ALBUM");

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            form: "123",
            values: {
                album: "ALBUM",
                film: "",
            },
        });

        setInputValueTo(dom, "film", "FILM");

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            form: "123",
            values: {
                album: "ALBUM",
                film: "FILM",
            },
        });
    });

    it("Should emit an update and a submit with the provided submitEvent", () => {
        const emit = vi.fn();
        const config = { formId: "123", submitEvent: "EVENT" };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const dom = form.render(STATE, emit);

        setInputValueTo(dom, "album", "ALBUM");
        submitForm(dom);

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            form: "123",
            values: { album: "ALBUM" },
        });
        expect(emit).toHaveBeenCalledWith("EVENT");
    });
});
