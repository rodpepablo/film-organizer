import { dialog, ipcMain } from "electron";
import AlbumService from "./album";
import FSService from "./fs";
import FilmService from "./film";
import { IdGenerator } from "../../infra/id-generator";

export default function loadServices() {
    const idGenerator = new IdGenerator();

    const fsService = new FSService(dialog);
    const albumService = new AlbumService();
    const filmService = new FilmService(idGenerator);

    fsService.load(ipcMain);
    albumService.load(ipcMain);
    filmService.load(ipcMain);
}
