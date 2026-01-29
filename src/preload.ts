import { contextBridge, ipcRenderer } from "electron";
import { Album } from "./domain/models/album";
import {
    GET_FILE_HANDLER,
    GET_FOLDER_HANDLER,
    LOAD_ALBUM_HANDLER,
    SAVE_ALBUM_HANDLER,
} from "./infra/ipc-events";
import "./preload-types";

contextBridge.exposeInMainWorld("api", {
    fs: {
        getFolder: (): Promise<string | null> =>
            ipcRenderer.invoke(GET_FOLDER_HANDLER),
        getFile: (): Promise<string | null> => ipcRenderer.invoke(GET_FILE_HANDLER),
    },
    album: {
        saveAlbum: (path: string, name: string): Promise<Album> =>
            ipcRenderer.invoke(SAVE_ALBUM_HANDLER, path, name),
        loadAlbum: (path: string): Promise<Album> =>
            ipcRenderer.invoke(LOAD_ALBUM_HANDLER, path),
    },
});
