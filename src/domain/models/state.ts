import { IState } from "choo";
import { Album } from "./album";
import { Location, Menus, Modal, Forms, Notification } from "./ui";

export interface State extends IState {
    location: Location;
    menus: Menus;
    modal: Modal;
    forms: Forms;
    notifications: Notification[];
    album: Album | null;
}

export type EventParams = {};

export type Emit = (event: string, params?: EventParams) => void;

export interface Emitter {
    on: (event: string, params: EventParams) => void;
    emit: Emit;
}
