import { join, basename, relative, dirname } from "path";
import fs from "fs/promises";
import { ADD_FILM_HANDLER } from "../../infra/ipc-events";
import { IIPCService, IPCErrors, IPCResult } from "../../infra/ipc-service";
import { Film, FilmImage } from "../models/film";
import { IFilmService } from "../ports/film";
import config from "../../../src/infra/config";
import { IIdGenerator } from "../../infra/id-generator";

type Event = Electron.IpcMainInvokeEvent;

export default class FilmService implements IFilmService, IIPCService {
    idGenerator: IIdGenerator;

    constructor(idGenerator: IIdGenerator) {
        this.idGenerator = idGenerator;
    }

    addFilm = async (
        _: Event,
        collectionPath: string,
        filmPath: string,
    ): Promise<IPCResult<Film>> => {
        const collectionFolder = dirname(collectionPath);
        if (!filmPath.startsWith(collectionFolder))
            return { ok: false, type: IPCErrors.FILM_FOLDER_OUTSIDE_COLLECTION_FOLDER };

        const filmRelativePath = relative(collectionFolder, filmPath);

        const files = await fs.readdir(filmPath);

        const filmImages: FilmImage[] = files
            .filter(this.filterSupportedFormats)
            .map((file: string) => {
                const split = file.split(".");
                return {
                    id: this.idGenerator.generate(),
                    name: split[0],
                    ext: split[1].toLowerCase(),
                    path: join(filmPath, file),
                };
            });

        const film: Film = {
            id: this.idGenerator.generate(),
            name: basename(filmPath),
            path: filmRelativePath,
            info: {
                camera: "",
                lens: "",
                filmStock: "",
                shotISO: "",
                filmStockExpiration: "",
            },
            images: filmImages,
        };

        return { ok: true, result: film };
    };

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(ADD_FILM_HANDLER, this.addFilm);
    }

    private filterSupportedFormats(file: string) {
        return (
            config.images.supportedFormats.indexOf(
                file.split(".")[1].toLowerCase(),
            ) >= 0
        );
    }
}
