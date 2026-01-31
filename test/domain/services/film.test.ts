import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mock } from "vitest-mock-extended";
import { join } from "path";
import FilmService from "../../../src/domain/services/film";
import { ADD_FILM_HANDLER } from "../../../src/infra/ipc-events";
import {
    createDummyFile,
    createFolder,
    createTemporalDirectory,
    removeDirectory,
} from "../../test-util/file-system";
import electron from "electron";
import { IPCErrors } from "../../../src/infra/ipc-service";

const EVENT = {} as electron.IpcMainInvokeEvent;

let temporalPath: string;
beforeEach(() => {
    temporalPath = createTemporalDirectory();
});

afterEach(() => {
    removeDirectory(temporalPath);
});

describe("Film Service", () => {
    it("add film should read the target folder and create the model with images", async () => {
        const filmService = new FilmService();
        const albumPath = join(temporalPath, "album.json");
        const filmPath = "gold-012026";
        const fullFilmPath = join(temporalPath, filmPath);
        createFolder(temporalPath, filmPath);
        createDummyFile(temporalPath, filmPath, "image.tif");
        createDummyFile(temporalPath, filmPath, "text.txt");
        createDummyFile(temporalPath, filmPath, "small.jpg");

        const filmResult = await filmService.addFilm(
            EVENT,
            albumPath,
            fullFilmPath,
        );

        expect(filmResult).toStrictEqual({
            ok: true,
            result: {
                name: "gold-012026",
                path: filmPath,
                images: [
                    {
                        name: "image",
                        ext: "tif",
                        path: join(temporalPath, filmPath, "image.tif"),
                    },
                    {
                        name: "small",
                        ext: "jpg",
                        path: join(temporalPath, filmPath, "small.jpg"),
                    },
                ],
            },
        });
    });

    it("If filmPath not inside albumPath raise error", async () => {
        const filmService = new FilmService();
        const albumPath = join(temporalPath, "album.json");
        const filmPath = join(temporalPath, "..", "wrong-directory");

        const filmResult = await filmService.addFilm(EVENT, albumPath, filmPath);

        expect(filmResult).toStrictEqual({
            ok: false,
            type: IPCErrors.FILM_FOLDER_OUTSIDE_ALBUM_FOLDER,
        });
    });

    it("should register handlers", () => {
        const filmService = new FilmService();
        const ipcMain = mock<electron.IpcMain>();

        filmService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            ADD_FILM_HANDLER,
            filmService.addFilm,
        );
    });
});
