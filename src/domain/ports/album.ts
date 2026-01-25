import { Album } from "../models/album";

export interface IAlbumService {
    getFolder(): Promise<string | null>;
    saveAlbum(
        event: Electron.IpcMainInvokeEvent,
        path: string,
        album: Album,
    ): Promise<void>;
}
