import { Album } from "../models/album";

export interface IAlbumService {
    saveAlbum(
        event: Electron.IpcMainInvokeEvent,
        path: string,
        name: string,
    ): Promise<Album>;
    loadAlbum(event: Electron.IpcMainInvokeEvent, path: string): Promise<Album>;
}
