import fs from "fs/promises";
import packageJSON from "../../../package.json";
import { join, dirname } from "path";
import { ICollectionService } from "../ports/collection";
import { IIPCService, IPCErrors, IPCResult } from "../../infra/ipc-service";
import {
    Collection,
    ZCollection,
    ZCollectionBasic,
} from "../models/collection";
import {
    LOAD_COLLECTION_HANDLER,
    CREATE_COLLECTION_HANDLER,
    SAVE_COLLECTION_HANDLER,
} from "../../infra/ipc-events";
import { Film, FilmImage } from "../models/film";
import { IMigrationManager } from "../../infra/migration-manager";

type Event = Electron.IpcMainInvokeEvent;

export default class CollectionService
    implements ICollectionService, IIPCService {
    private migrationManager: IMigrationManager;

    constructor(migrationManager: IMigrationManager) {
        this.migrationManager = migrationManager;
    }

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(CREATE_COLLECTION_HANDLER, this.createCollection);
        ipcMain.handle(LOAD_COLLECTION_HANDLER, this.loadCollection);
        ipcMain.handle(SAVE_COLLECTION_HANDLER, this.saveCollection);
    }

    createCollection = async (
        _: Event,
        path: string,
        name: string,
    ): Promise<Collection> => {
        const collection = {
            app: packageJSON.name,
            version: packageJSON.version,
            name,
            path: join(path, `${name}.json`),
            films: [],
        } as Collection;

        await fs.writeFile(collection.path, JSON.stringify(collection));

        return collection;
    };

    loadCollection = async (
        _: Event,
        path: string,
    ): Promise<IPCResult<Collection>> => {
        const content = await fs.readFile(path, { encoding: "utf-8" });
        const collection: Collection = JSON.parse(content);

        try {
            ZCollectionBasic.parse(collection);

            if (collection.version === packageJSON.version) {
                ZCollection.parse(collection);
                return { ok: true, result: collection };
            }

            const migrated = this.migrationManager.applyMigrations({
                ...collection,
                path,
            });
            ZCollection.parse(migrated);

            await this.writeCollection(migrated);

            return { ok: true, result: migrated };
        } catch (error) {
            return { ok: false, type: IPCErrors.INVALID_COLLECTION_FILE };
        }
    };

    saveCollection = async (
        _: Event,
        collection: Collection,
    ): Promise<Collection> => {
        const savedCollection = {
            ...collection,
            films: collection.films.map(this.parseFilm),
        };
        await this.writeCollection(savedCollection);
        await Promise.all(collection.films.map(this.postProcessFilm));

        return savedCollection;
    };

    private writeCollection(collection: Collection) {
        return fs.writeFile(collection.path, JSON.stringify(collection), {
            encoding: "utf-8",
        });
    }

    private async postProcessFilm(film: Film): Promise<void[]> {
        // Rename images to their id before renaming to the saved name
        // to avoid problems when swaping names between images.
        await Promise.all(
            film.images.map((image) =>
                fs.rename(
                    image.path,
                    join(dirname(image.path), `${image.id}.${image.ext}`),
                ),
            ),
        );

        return Promise.all(
            film.images.map((image) =>
                fs.rename(
                    join(dirname(image.path), `${image.id}.${image.ext}`),
                    join(dirname(image.path), `${image.name}.${image.ext}`),
                ),
            ),
        );
    }

    private parseFilm = (film: Film): Film => {
        return {
            ...film,
            images: film.images.map(this.parseImage),
        };
    };

    private parseImage = (image: FilmImage): FilmImage => {
        const imageDirname = dirname(image.path);
        return {
            ...image,
            path: join(imageDirname, `${image.name}.${image.ext}`),
            previewPath: null,
        };
    };
}
