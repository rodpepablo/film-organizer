import { State } from "../../domain/models/state";

export const uiMenuStateSelector = (
    menu: string,
    state: Pick<State, "ui">,
): boolean => state.ui[menu];
