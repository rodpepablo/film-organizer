import { IState } from "choo";
import { Album } from "./album";
import { Menus, Modal, Forms } from "./ui";

export interface State extends IState {
    menus: Menus;
    modal: Modal;
    forms: Forms;
    album: Album | null;
}

export type EventParams = {};

export type Emit = (event: string, params?: EventParams) => void;

export interface Emitter {
    on: (event: string, params: EventParams) => void;
    emit: Emit;
}
