import fs from "fs/promises";
import { join } from "path";
import { IAlbumService } from "../ports/album";
import { IIPCService } from "../../infra/ipc-service";
import { Album } from "../models/album";
import {
    LOAD_ALBUM_HANDLER,
    CREATE_ALBUM_HANDLER,
    SAVE_ALBUM_HANDLER,
} from "../../infra/ipc-events";

type Event = Electron.IpcMainInvokeEvent;

export default class AlbumService implements IAlbumService, IIPCService {
    createAlbum = async (
        _: Event,
        path: string,
        name: string,
    ): Promise<Album> => {
        const album = {
            name,
            path: join(path, `${name}.json`),
            films: [],
        } as Album;

        await fs.writeFile(album.path, JSON.stringify(album));

        return album;
    };

    loadAlbum = async (_: Event, path: string): Promise<Album> => {
        const content = await fs.readFile(path, { encoding: "utf-8" });
        const album: Album = JSON.parse(content);

        return { ...album, path };
    };

    saveAlbum = async (_: Event, album: Album): Promise<void> => {
        return fs.writeFile(album.path, JSON.stringify(album), {
            encoding: "utf-8",
        });
    };

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(CREATE_ALBUM_HANDLER, this.createAlbum);
        ipcMain.handle(LOAD_ALBUM_HANDLER, this.loadAlbum);
        ipcMain.handle(SAVE_ALBUM_HANDLER, this.saveAlbum);
    }
}
