import Nanobus from "nanobus";
import { TOGGLE_NAV_MENU } from "../../infra/events";
import { EventParams, State } from "../models/state";

export type ToggleNavMenuParams = EventParams & {
    menu: string;
};

export function uiStore(state: Pick<State, "ui">, emitter: Nanobus): void {
    emitter.on(TOGGLE_NAV_MENU, (params: ToggleNavMenuParams) => {
        if (params.menu in state.ui) {
            state.ui[params.menu] = !state.ui[params.menu];
        }
        emitter.emit("render");
    });
}
