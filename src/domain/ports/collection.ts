import { IPCResult } from "../../infra/ipc-service";
import { Collection } from "../models/collection";

export interface ICollectionService {
    createCollection(
        event: Electron.IpcMainInvokeEvent,
        path: string,
        name: string,
    ): Promise<Collection>;
    loadCollection(
        event: Electron.IpcMainInvokeEvent,
        path: string,
    ): Promise<IPCResult<Collection>>;
    saveCollection(
        event: Electron.IpcMainInvokeEvent,
        collection: Collection,
    ): Promise<Collection>;
}
