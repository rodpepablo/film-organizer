import { app, dialog, ipcMain } from "electron";
import CollectionService from "./collection";
import FSService from "./fs";
import FilmService from "./film";
import { IdGenerator } from "../../infra/id-generator";
import FilmImageService from "./film-image";
import SharpImageProcessing from "../../infra/adapters/sharp-image-processing";

export default function loadServices() {
    const idGenerator = new IdGenerator();
    const sharpImageProcessing = new SharpImageProcessing(app.getPath("temp"));

    const fsService = new FSService(dialog);
    const collectionService = new CollectionService();
    const filmService = new FilmService(idGenerator);
    const filmImageService = new FilmImageService(sharpImageProcessing);

    fsService.load(ipcMain);
    collectionService.load(ipcMain);
    filmService.load(ipcMain);
    filmImageService.load(ipcMain);
}
