import { Collection } from "../../domain/models/collection";
import { State } from "../../domain/models/state";

export const collectionSelector = (state: Pick<State, "collection">): Collection | null =>
    state.collection;

export const collectionNameSelector = (state: Pick<State, "collection">) =>
    state.collection?.name || null;
