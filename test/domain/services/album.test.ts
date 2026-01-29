import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mock } from "vitest-mock-extended";
import { join } from "path";
import electron, { IpcMainInvokeEvent } from "electron";
import AlbumService from "../../../src/domain/services/album";
import {
    createTemporalDirectory,
    loadJSON,
    saveJSON,
    removeDirectory,
} from "../../test-util/file-system";
import { Album } from "../../../src/domain/models/album";
import {
    LOAD_ALBUM_HANDLER,
    CREATE_ALBUM_HANDLER,
} from "../../../src/infra/ipc-events";
import { anAlbum } from "../../test-util/fixtures";

const NAME = "album_name";

const EVENT = {} as IpcMainInvokeEvent;
let temporalDirectory: string;

beforeEach(() => {
    temporalDirectory = createTemporalDirectory();
});

afterEach(() => {
    removeDirectory(temporalDirectory);
});

describe("AlbumService", () => {
    it("Should save an album to a designated file", async () => {
        const albumService = new AlbumService();

        const createdAlbum = await albumService.createAlbum(
            EVENT,
            temporalDirectory,
            NAME,
        );

        const expectedAlbum = {
            name: NAME,
            path: join(temporalDirectory, `${NAME}.json`),
        };

        expect(createdAlbum).toStrictEqual(expectedAlbum);
        const savedAlbum = loadJSON<Album>(expectedAlbum.path);
        expect(savedAlbum).toStrictEqual(expectedAlbum);
    });

    it("Should load an album from a designated path", async () => {
        const fullpath = join(temporalDirectory, "test.json");
        const savedAlbum = anAlbum({ path: "/last/path.json" });
        saveJSON(fullpath, savedAlbum);

        const albumService = new AlbumService();

        const album = await albumService.loadAlbum(EVENT, fullpath);

        expect(album).toStrictEqual(
            anAlbum({
                ...savedAlbum,
                path: fullpath,
            }),
        );
    });

    it("Should load IPC handlers", () => {
        const albumService = new AlbumService();
        const ipcMain = mock<electron.IpcMain>();

        albumService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            CREATE_ALBUM_HANDLER,
            albumService.createAlbum,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            LOAD_ALBUM_HANDLER,
            albumService.loadAlbum,
        );
    });
});
