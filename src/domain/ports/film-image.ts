import { IPCResult } from "../../infra/ipc-service";
import { FilmImage } from "../models/film";

export interface IFilmImageService {
    createPreviewImage(
        event: Electron.IpcMainInvokeEvent,
        image: FilmImage,
    ): Promise<IPCResult<string>>;
}
