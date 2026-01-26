import fs from "fs/promises";
import { IAlbumService } from "../ports/album";
import { IIPCService } from "../../infra/ipc-service";
import { Album } from "../models/album";
import { LOAD_ALBUM_HANDLER, SAVE_ALBUM_HANDLER } from "../../infra/ipc-events";

export default class AlbumService implements IAlbumService, IIPCService {
    saveAlbum = async (
        _: Electron.IpcMainInvokeEvent,
        path: string,
        album: Album,
    ): Promise<void> => {
        const fullpath = `${path}/${album.name}.json`;
        await fs.writeFile(fullpath, JSON.stringify(album));

        return;
    };

    loadAlbum = async (
        _: Electron.IpcMainInvokeEvent,
        path: string,
    ): Promise<Album> => {
        const content = await fs.readFile(path, { encoding: "utf-8" });
        return JSON.parse(content);
    };

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(SAVE_ALBUM_HANDLER, this.saveAlbum);
        ipcMain.handle(LOAD_ALBUM_HANDLER, this.loadAlbum);
    }
}
