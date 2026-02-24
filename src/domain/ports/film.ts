import { IPCResult } from "../../infra/ipc-service";
import { Film } from "../models/film";

export interface IFilmService {
    addFilm(
        _: Electron.IpcMainInvokeEvent,
        collectionPath: string,
        filmPath: string,
    ): Promise<IPCResult<Film>>;
}
