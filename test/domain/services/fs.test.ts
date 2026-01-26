import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import electron from "electron";
import FSService from "../../../src/domain/services/fs";
import {
    GET_FILE_HANDLER,
    GET_FOLDER_HANDLER,
} from "../../../src/infra/ipc-events";

describe("AlbumService", () => {
    it("Should get the folder path if selected", async () => {
        const dialog = mock<electron.Dialog>();
        const fsService = new FSService(dialog);
        dialog.showOpenDialog.mockResolvedValue({
            canceled: false,
            filePaths: ["PATH"],
        });

        const path = await fsService.getFolder();

        expect(dialog.showOpenDialog).toHaveBeenCalledWith({
            properties: ["openDirectory"],
        });
        expect(path).toEqual("PATH");
    });

    it("Should return null if get folder dialog gets cancelled", async () => {
        const dialog = mock<electron.Dialog>();
        const fsService = new FSService(dialog);
        dialog.showOpenDialog.mockResolvedValue({
            canceled: true,
            filePaths: [],
        });

        const path = await fsService.getFolder();

        expect(dialog.showOpenDialog).toHaveBeenCalledWith({
            properties: ["openDirectory"],
        });
        expect(path).toBeNull();
    });
    it("Should get the folder path if selected", async () => {
        const dialog = mock<electron.Dialog>();
        const fsService = new FSService(dialog);
        dialog.showOpenDialog.mockResolvedValue({
            canceled: false,
            filePaths: ["PATH/TO/FILE.json"],
        });

        const path = await fsService.getFile();

        expect(dialog.showOpenDialog).toHaveBeenCalledWith({
            properties: ["openFile"],
        });
        expect(path).toEqual("PATH/TO/FILE.json");
    });

    it("Should return null if get folder dialog gets cancelled", async () => {
        const dialog = mock<electron.Dialog>();
        const fsService = new FSService(dialog);
        dialog.showOpenDialog.mockResolvedValue({
            canceled: true,
            filePaths: [],
        });

        const path = await fsService.getFile();

        expect(dialog.showOpenDialog).toHaveBeenCalledWith({
            properties: ["openFile"],
        });
        expect(path).toBeNull();
    });

    it("Should load IPC handlers", () => {
        const fsService = new FSService(mock());
        const ipcMain = mock<electron.IpcMain>();

        fsService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            GET_FOLDER_HANDLER,
            fsService.getFolder,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            GET_FILE_HANDLER,
            fsService.getFile,
        );
    });
});
