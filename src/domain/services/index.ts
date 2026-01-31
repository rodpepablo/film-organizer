import { dialog, ipcMain } from "electron";
import AlbumService from "./album";
import FSService from "./fs";
import FilmService from "./film";

export default function loadServices() {
    const fsService = new FSService(dialog);
    const albumService = new AlbumService();
    const filmService = new FilmService();

    fsService.load(ipcMain);
    albumService.load(ipcMain);
    filmService.load(ipcMain);
}
