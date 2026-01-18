import Nanobus from "nanobus";
import { CLOSE_MODAL, OPEN_MODAL, TOGGLE_NAV_MENU } from "../../infra/events";
import { EventParams, State } from "../models/state";

export type ToggleNavMenuParams = EventParams & {
    menu: string;
};

export type OpenModalParams = EventParams & {
    modalId: string;
};

export function uiStore(
    state: Pick<State, "menus" | "modal">,
    emitter: Nanobus,
): void {
    emitter.on(TOGGLE_NAV_MENU, (params: ToggleNavMenuParams) => {
        if (params.menu in state.menus) {
            state.menus[params.menu] = !state.menus[params.menu];
        }
        emitter.emit("render");
    });

    emitter.on(OPEN_MODAL, (params: OpenModalParams) => {
        state.modal.active = true;
        state.modal.modalId = params.modalId;
        emitter.emit("render");
    });

    emitter.on(CLOSE_MODAL, () => {
        state.modal.active = false;
        state.modal.modalId = null;
        emitter.emit("render");
    });
}
