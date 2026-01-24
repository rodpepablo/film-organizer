import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { html } from "../../../../src/infra/html";
import Form from "../../../../src/ui/components/general/form/form";
import { setInputValueTo, submitForm } from "../../../test-util/dom";
const state = { forms: {} } as State;

const CONTENT_WITH_INPUT = html`<input name="album"/>`;

describe("Form Component", () => {
    it("Should inject the content into the form", () => {
        const config = { formId: "", onSubmit: () => { } };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const dom = form.render(state, () => { });
        const input = dom.querySelector('input[name="album"]');

        expect(input).not.toBeNull();
    });

    it("Should provide form data and execute the submit handler", () => {
        const onSubmit = vi.fn();
        const emit = vi.fn();
        const config = { formId: "", onSubmit };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const dom = form.render(state, emit);

        setInputValueTo(dom, "album", "ALBUM");
        submitForm(dom);

        expect(onSubmit).toHaveBeenCalledOnce();
        const call = onSubmit.mock.calls[0];
        expect(call[0]).toBe(emit);
        expect(call[1].get("album")).toStrictEqual("ALBUM");
    });

    it("Should show error if exists", () => {
        const config = { formId: "FORM", onSubmit: () => { } };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const state = {
            forms: {
                FORM: { error: "ERROR" },
            },
        };
        const dom = form.render(state, vi.fn());

        expect(dom.querySelector(".form-error")?.innerHTML).toEqual("ERROR");
    });

    it("Shouldn't show and error when there is none", () => {
        const config = { formId: "FORM", onSubmit: () => { } };
        const form = new Form(config, CONTENT_WITH_INPUT);
        const state = { forms: {} };
        const dom = form.render(state, vi.fn());

        expect(dom.querySelector(".form-error")).toBeNull();
    });
});
