import { GET_FILE_HANDLER } from "../../infra/ipc-events";
import { IIPCService } from "../../infra/ipc-service";
import { IFSService } from "../ports/fs";

export default class FSService implements IFSService, IIPCService {
    private dialog: Electron.Dialog;

    constructor(dialog: Electron.Dialog) {
        this.dialog = dialog;
    }

    getFile = async (): Promise<string> => {
        const result = await this.dialog.showOpenDialog({
            properties: ["openFile"],
        });

        if (result.canceled) return null;

        return result.filePaths[0];
    };

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(GET_FILE_HANDLER, this.getFile);
    }
}
