import { Album } from "../models/album";

export interface IAlbumService {
    saveAlbum(
        event: Electron.IpcMainInvokeEvent,
        path: string,
        album: Album,
    ): Promise<void>;
    loadAlbum(event: Electron.IpcMainInvokeEvent, path: string): Promise<Album>;
}
