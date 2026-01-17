import { IState } from "choo";

export interface State extends IState {
    ui: {
        [key: string]: boolean;
    };
}

export type EventParams = {};

export type Emit = (event: string, params?: EventParams) => void;

export interface Emitter {
    on: (event: string, params: EventParams) => void;
    emit: Emit;
}
