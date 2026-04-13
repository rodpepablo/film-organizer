import "./modal.css";
import { html } from "@html";
import { State, Emit } from "../../../../../../domain/models/state";
import { uiModalSelector } from "../../../../selectors/ui";
import Component from "../../../component";
import { ModalConfig } from "./modal-config";
import { closeModal } from "../../../../actions/ui";

export default class ModalComponent implements Component {
    modalConfig: ModalConfig;

    constructor(modalConfig: ModalConfig) {
        this.modalConfig = modalConfig;
    }

    render(state: State, emit: Emit): HTMLElement {
        const modalInfo = uiModalSelector(state);
        const selected = this.modalConfig[modalInfo.modalId!];

        return modalInfo.active && selected != null
            ? html`
                <section class="modal" onclick=${this.closeModal(emit)}>
                    <article class="modal-content" onclick=${this.preventDefault}>
                        ${selected.render(state, emit)}
                    </article>
                </section>
            `
            : html``;
    }

    closeModal(emit: Emit) {
        return (e: DOMEvent) => {
            e.stopPropagation();
            e.preventDefault();
            closeModal(emit);
        };
    }

    preventDefault(e: DOMEvent) {
        e.stopPropagation();
    }
}
