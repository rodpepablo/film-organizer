import { contextBridge, ipcRenderer } from "electron";
import { Album } from "./domain/models/album";
import { Film } from "./domain/models/film";
import {
    GET_FILE_HANDLER,
    GET_FOLDER_HANDLER,
    LOAD_ALBUM_HANDLER,
    CREATE_ALBUM_HANDLER,
    ADD_FILM_HANDLER,
    SAVE_ALBUM_HANDLER,
} from "./infra/ipc-events";
import { IPCResult } from "./infra/ipc-service";
import "./preload-types";

contextBridge.exposeInMainWorld("api", {
    fs: {
        getFolder: (): Promise<string | null> =>
            ipcRenderer.invoke(GET_FOLDER_HANDLER),
        getFile: (): Promise<string | null> => ipcRenderer.invoke(GET_FILE_HANDLER),
    },
    album: {
        createAlbum: (path: string, name: string): Promise<Album> =>
            ipcRenderer.invoke(CREATE_ALBUM_HANDLER, path, name),
        loadAlbum: (path: string): Promise<Album> =>
            ipcRenderer.invoke(LOAD_ALBUM_HANDLER, path),
        saveAlbum: (album: Album): Promise<void> =>
            ipcRenderer.invoke(SAVE_ALBUM_HANDLER, album),
    },
    film: {
        addFilm: (albumPath: string, filmPath: string): Promise<IPCResult<Film>> =>
            ipcRenderer.invoke(ADD_FILM_HANDLER, albumPath, filmPath),
    },
});
