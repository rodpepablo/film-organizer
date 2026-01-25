import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mock } from "vitest-mock-extended";
import electron, { IpcMainInvokeEvent } from "electron";
import AlbumService from "../../../src/domain/services/album";
import {
    createTemporalDirectory,
    loadJSON,
    removeDirectory,
} from "../../test-util/file-system";
import { Album } from "../../../src/domain/models/album";
import {
    GET_FOLDER_HANDLER,
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
    it("Should get the folder path if selected", async () => {
        const dialog = mock<electron.Dialog>();
        const albumService = new AlbumService(dialog);
        dialog.showOpenDialog.mockResolvedValue({
            canceled: false,
            filePaths: ["PATH"],
        });

        const path = await albumService.getFolder();

        expect(dialog.showOpenDialog).toHaveBeenCalledWith({
            properties: ["openDirectory"],
        });
        expect(path).toEqual("PATH");
    });

    it("Should return null if get folder dialog gets cancelled", async () => {
        const dialog = mock<electron.Dialog>();
        const albumService = new AlbumService(dialog);
        dialog.showOpenDialog.mockResolvedValue({
            canceled: true,
            filePaths: [],
        });

        const path = await albumService.getFolder();

        expect(dialog.showOpenDialog).toHaveBeenCalledWith({
            properties: ["openDirectory"],
        });
        expect(path).toBeNull();
    });

    it("Should save an album to a designated file", async () => {
        const albumService = new AlbumService(mock());
        const album = { name: "album_name" };

        await albumService.saveAlbum(EVENT, temporalDirectory, album);

        const expectedPath = `${temporalDirectory}/${album.name}.json`;
        const savedAlbum = loadJSON<Album>(expectedPath);
        expect(savedAlbum).toStrictEqual(album);
    });

    it("Should load IPC handlers", () => {
        const albumService = new AlbumService(mock());
        const ipcMain = mock<electron.IpcMain>();

        albumService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            GET_FOLDER_HANDLER,
            albumService.getFolder,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            SAVE_ALBUM_HANDLER,
            albumService.saveAlbum,
        );
    });
});
