import { State, Emit } from "../domain/models/state";

export default interface Component {
    render: (state: State, emit: Emit) => HTMLElement;
}
