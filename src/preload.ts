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
        getFolder: () => ipcRenderer.invoke(GET_FOLDER_HANDLER),
        getFile: () => ipcRenderer.invoke(GET_FILE_HANDLER),
    },
    album: {
        saveAlbum: (path: string, album: Album) =>
            ipcRenderer.invoke(SAVE_ALBUM_HANDLER, path, album),
        loadAlbum: (path: string) => ipcRenderer.invoke(LOAD_ALBUM_HANDLER, path),
    },
});
