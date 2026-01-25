import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import electron from "electron";
import AlbumService, {
    GET_FOLDER_HANDLER,
} from "../../../src/domain/services/album";

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

    it("Should load IPC handlers", () => {
        const albumService = new AlbumService(mock());
        const ipcMain = mock<electron.IpcMain>();

        albumService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            GET_FOLDER_HANDLER,
            albumService.getFolder,
        );
    });
});
