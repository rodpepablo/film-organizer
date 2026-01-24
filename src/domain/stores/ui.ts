import Nanobus from "nanobus";
import {
    CLEAR_FORM,
    CLOSE_MODAL,
    FORM_ERROR,
    OPEN_MODAL,
    TOGGLE_NAV_MENU,
} from "../../infra/events";
import { EventParams, State } from "../models/state";

export type ToggleNavMenuParams = EventParams & {
    menu: string;
};

export type OpenModalParams = EventParams & {
    modalId: string;
};

export type FormEventParams = EventParams & {
    form: string;
};

export type FormErrorParams = FormEventParams & {
    error: string;
};

type Substate = Pick<State, "menus" | "modal" | "forms">;

export function uiStore(state: Substate, emitter: Nanobus): void {
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

    emitter.on(FORM_ERROR, (params: FormErrorParams) => {
        initForm(state, params);
        state.forms[params.form].error = params.error;
        emitter.emit("render");
    });

    emitter.on(CLEAR_FORM, (params: FormEventParams) => {
        initForm(state, params);
        state.forms[params.form].error = null;
        emitter.emit("render");
    });
}

function initForm(state: Substate, params: FormEventParams) {
    if (!(params.form in state.forms)) {
        state.forms[params.form] = {};
    }
}
