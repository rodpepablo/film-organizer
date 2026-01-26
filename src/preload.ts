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
        getFile: () => ipcRenderer.invoke(GET_FILE_HANDLER),
    },
    album: {
        getFolder: () => ipcRenderer.invoke(GET_FOLDER_HANDLER),
        saveAlbum: (path: string, album: Album) =>
            ipcRenderer.invoke(SAVE_ALBUM_HANDLER, path, album),
        loadAlbum: (path: string) => ipcRenderer.invoke(LOAD_ALBUM_HANDLER, path),
    },
});
