import electron from "electron";
import { GET_FOLDER_HANDLER } from "./domain/services/album";

electron.contextBridge.exposeInMainWorld("api", {
    album: {
        getFolder: () => electron.ipcRenderer.invoke(GET_FOLDER_HANDLER),
    },
});

declare global {
    interface Window {
        api: {
            album: {
                getFolder(): Promise<string | null>;
            };
        };
    }
}
