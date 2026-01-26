import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mock } from "vitest-mock-extended";
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
    SAVE_ALBUM_HANDLER,
} from "../../../src/infra/ipc-events";

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
        const album = { name: "album_name" };

        await albumService.saveAlbum(EVENT, temporalDirectory, album);

        const expectedPath = `${temporalDirectory}/${album.name}.json`;
        const savedAlbum = loadJSON<Album>(expectedPath);
        expect(savedAlbum).toStrictEqual(album);
    });

    it("Should load an album from a designated path", async () => {
        const fullpath = `${temporalDirectory}/test.json`;
        const expectedAlbum = { name: "test-album" };
        saveJSON(fullpath, expectedAlbum);
        const albumService = new AlbumService();

        const album = await albumService.loadAlbum(EVENT, fullpath);

        expect(album).toStrictEqual(expectedAlbum);
    });

    it("Should load IPC handlers", () => {
        const albumService = new AlbumService();
        const ipcMain = mock<electron.IpcMain>();

        albumService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            SAVE_ALBUM_HANDLER,
            albumService.saveAlbum,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            LOAD_ALBUM_HANDLER,
            albumService.loadAlbum,
        );
    });
});
