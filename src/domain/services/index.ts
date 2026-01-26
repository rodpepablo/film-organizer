import AlbumService from "./album";
import { dialog, ipcMain } from "electron";
import FSService from "./fs";

export default function loadServices() {
    const fsService = new FSService(dialog);
    const albumService = new AlbumService();

    fsService.load(ipcMain);
    albumService.load(ipcMain);
}
