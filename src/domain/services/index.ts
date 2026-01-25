import AlbumService from "./album";
import { dialog, ipcMain } from "electron";

export default function loadServices() {
    const albumService = new AlbumService(dialog);

    albumService.load(ipcMain);
}
