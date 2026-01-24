import { Modal } from "../../domain/models/ui";
import { State } from "../../domain/models/state";

export const uiMenuStateSelector = (
    menu: string,
    state: Pick<State, "menus">,
): boolean => state.menus[menu];

export const uiModalSelector = (state: Pick<State, "modal">): Modal =>
    state.modal;

export const uiFormErrorSelector = (
    state: Pick<State, "forms">,
    form: string,
): string | null => (form in state.forms ? state.forms[form].error : null);
