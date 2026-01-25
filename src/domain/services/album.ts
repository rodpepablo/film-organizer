import fs from "fs/promises";
import { IAlbumService } from "../ports/album";
import { IIPCService } from "../../infra/ipc-service";
import { Album } from "../models/album";
import { GET_FOLDER_HANDLER, SAVE_ALBUM_HANDLER } from "../../infra/ipc-events";

export default class AlbumService implements IAlbumService, IIPCService {
    private dialog: Electron.Dialog;

    constructor(dialog: Electron.Dialog) {
        this.dialog = dialog;
    }

    getFolder = async (): Promise<string | null> => {
        const result = await this.dialog.showOpenDialog({
            properties: ["openDirectory"],
        });

        if (result.canceled) return null;

        return result.filePaths[0];
    };

    saveAlbum = async (
        _: Electron.IpcMainInvokeEvent,
        path: string,
        album: Album,
    ): Promise<void> => {
        const fullpath = `${path}/${album.name}.json`;
        await fs.writeFile(fullpath, JSON.stringify(album));

        return;
    };

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(GET_FOLDER_HANDLER, this.getFolder);
        ipcMain.handle(SAVE_ALBUM_HANDLER, this.saveAlbum);
    }
}
