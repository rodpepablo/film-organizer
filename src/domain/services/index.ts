import { app, dialog, ipcMain } from "electron";
import CollectionService from "./collection";
import FSService from "./fs";
import FilmService from "./film";
import { IdGenerator } from "../../infra/adapters/id-generator";
import FilmImageService from "./film-image";
import SharpImageProcessing from "../../infra/adapters/sharp-image-processing";
import MigrationManager from "../../infra/migration-manager";

export default function loadServices() {
    const idGenerator = new IdGenerator();
    const sharpImageProcessing = new SharpImageProcessing(app.getPath("temp"));
    const migrationManager = new MigrationManager(app.getVersion());

    const fsService = new FSService(dialog);
    const collectionService = new CollectionService(migrationManager);
    const filmService = new FilmService(idGenerator);
    const filmImageService = new FilmImageService(sharpImageProcessing);

    fsService.load(ipcMain);
    collectionService.load(ipcMain);
    filmService.load(ipcMain);
    filmImageService.load(ipcMain);
}
