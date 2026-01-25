import { IAlbumService } from "../ports/album";
import { IIPCService } from "../../infra/ipc-service";

export const GET_FOLDER_HANDLER = "GET_FOLDER_HANDLER";

export default class AlbumService implements IAlbumService, IIPCService {
    private dialog: Electron.Dialog;

    constructor(dialog: Electron.Dialog) {
        this.dialog = dialog;
    }

    getFolder = async (): Promise<string | null> => {
        const result = await this.dialog.showOpenDialog({
            properties: ["openDirectory"],
        });

        if (result.canceled) return null;

        return result.filePaths[0];
    };

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(GET_FOLDER_HANDLER, this.getFolder);
    }
}
