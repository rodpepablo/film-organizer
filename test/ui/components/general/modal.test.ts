import { describe, it, expect, vi } from "vitest";
import { html } from "../../../../src/infra/html";
import Component from "../../../../src/infra/component";
import { Emit, State } from "../../../../src/domain/models/state";
import { CLOSE_MODAL } from "../../../../src/infra/events";
import ModalComponent from "../../../../src/ui/components/general/modal/modal";

describe("Modal component", () => {
    it("should not show modal when modal is not active", () => {
        const state = {
            modal: {
                active: false,
                modalId: null,
            },
        };
        const modal = new ModalComponent({});
        const component = modal.render(state as State, vi.fn());
        expect(component).toBeUndefined();
    });

    it("should select correct modal", () => {
        const state = {
            modal: {
                active: true,
                modalId: "test-modal",
            },
        };
        const modal = new ModalComponent({
            "test-modal": new TestModal("test-modal"),
            "other-modal": new TestModal("other-modal"),
        });
        const component = modal.render(state as State, vi.fn());

        expect(component.querySelector("#selected")?.innerHTML).toEqual(
            "test-modal",
        );
    });

    it("Should close modal when clicking on background", () => {
        const state = {
            modal: {
                active: true,
                modalId: "custom-modal",
            },
        };
        const emit = vi.fn();
        const modal = new ModalComponent({
            "custom-modal": new TestModal("custom-modal"),
        });
        const component = modal.render(state as State, emit);
        component.click();

        expect(emit).toHaveBeenCalledWith(CLOSE_MODAL);
    });
});

class TestModal implements Component {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
    render(state: State, emit: Emit) {
        return html`<h1 id="selected">${this.id}</h1>`;
    }
}
