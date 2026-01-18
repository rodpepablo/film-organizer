import { IState } from "choo";
import { Album } from "./album";

export interface State extends IState {
    ui: {
        [key: string]: boolean;
    };
    album: Album | null;
}

export type EventParams = {};

export type Emit = (event: string, params?: EventParams) => void;

export interface Emitter {
    on: (event: string, params: EventParams) => void;
    emit: Emit;
}
