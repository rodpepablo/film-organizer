import electron from "electron";
import { Album } from "./domain/models/album";
import { GET_FOLDER_HANDLER, SAVE_ALBUM_HANDLER } from "./infra/ipc-events";
import "./preload-types";

electron.contextBridge.exposeInMainWorld("api", {
    album: {
        getFolder: () => electron.ipcRenderer.invoke(GET_FOLDER_HANDLER),
        saveAlbum: (path: string, album: Album) =>
            electron.ipcRenderer.invoke(SAVE_ALBUM_HANDLER, path, album),
    },
});
