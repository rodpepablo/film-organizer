import { IState } from "choo";
import { Album } from "./album";
import { Menus, Modal } from "./ui";

export interface State extends IState {
    menus: Menus;
    modal: Modal;
    album: Album | null;
}

export type EventParams = {};

export type Emit = (event: string, params?: EventParams) => void;

export interface Emitter {
    on: (event: string, params: EventParams) => void;
    emit: Emit;
}
