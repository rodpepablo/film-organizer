export interface IIPCService {
    load(ipcMain: Electron.IpcMain): void;
}

export enum IPCErrors {
    FILM_FOLDER_OUTSIDE_ALBUM_FOLDER,
    UNEXPECTED_ERROR,
}

export type IPCError = {
    ok: false;
    type: IPCErrors;
    message?: string;
};

export type IPCResult<T> = { ok: true; result: T } | IPCError;
