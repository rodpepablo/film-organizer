import { contextBridge, ipcRenderer } from "electron";
import { Collection } from "./domain/models/collection";
import { Film, FilmImage } from "./domain/models/film";
import {
    GET_FILE_HANDLER,
    GET_FOLDER_HANDLER,
    LOAD_COLLECTION_HANDLER,
    CREATE_COLLECTION_HANDLER,
    ADD_FILM_HANDLER,
    SAVE_COLLECTION_HANDLER,
    CREATE_IMAGE_PREVIEW_HANDLER,
} from "./infra/ipc-events";
import { IPCResult } from "./infra/ipc-service";
import "./preload-types";

contextBridge.exposeInMainWorld("api", {
    fs: {
        getFolder: (): Promise<string | null> =>
            ipcRenderer.invoke(GET_FOLDER_HANDLER),
        getFile: (): Promise<string | null> => ipcRenderer.invoke(GET_FILE_HANDLER),
    },
    collection: {
        createCollection: (path: string, name: string): Promise<Collection> =>
            ipcRenderer.invoke(CREATE_COLLECTION_HANDLER, path, name),
        loadCollection: (path: string): Promise<Collection> =>
            ipcRenderer.invoke(LOAD_COLLECTION_HANDLER, path),
        saveCollection: (collection: Collection): Promise<Collection> =>
            ipcRenderer.invoke(SAVE_COLLECTION_HANDLER, collection),
    },
    film: {
        addFilm: (collectionPath: string, filmPath: string): Promise<IPCResult<Film>> =>
            ipcRenderer.invoke(ADD_FILM_HANDLER, collectionPath, filmPath),
    },
    image: {
        createPreviewImage: (image: FilmImage): Promise<IPCResult<string>> =>
            ipcRenderer.invoke(CREATE_IMAGE_PREVIEW_HANDLER, image),
    },
});
