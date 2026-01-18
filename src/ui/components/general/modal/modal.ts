import "./modal.css";
import { html } from "../../../../infra/html";
import { State, Emit } from "../../../../domain/models/state";
import { CLOSE_MODAL } from "../../../../infra/events";
import { uiModalSelector } from "../../../../infra/selectors/ui";
import Component from "../../../../infra/component";
import { ModalConfig } from "./modal-config";

export default class ModalComponent implements Component {
    modalConfig: ModalConfig;

    constructor(modalConfig: ModalConfig) {
        this.modalConfig = modalConfig;
    }

    render(state: State, emit: Emit): HTMLElement {
        const modalInfo = uiModalSelector(state);
        const selected = this.modalConfig[modalInfo.modalId];

        return modalInfo.active && selected != null
            ? html`
                <section class="modal" onclick=${this.closeModal(emit)}>
                    <article class="modal-content">
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
            emit(CLOSE_MODAL);
        };
    }
}
