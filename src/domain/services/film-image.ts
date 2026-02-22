import { join } from "path";
import fs, { constants } from "fs/promises";
import { CREATE_IMAGE_PREVIEW_HANDLER } from "../../infra/ipc-events";
import { IIPCService, IPCResult } from "../../infra/ipc-service";
import { FilmImage } from "../models/film";
import { IFilmImageService } from "../ports/film-image";
import { IImageProcessing } from "../ports/image-processing";

type Event = Electron.IpcMainInvokeEvent;

export default class FilmImageService
    implements IFilmImageService, IIPCService {
    private imageProcessing: IImageProcessing;

    constructor(imageProcessing: IImageProcessing) {
        this.imageProcessing = imageProcessing;
    }

    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(CREATE_IMAGE_PREVIEW_HANDLER, this.createPreviewImage);
    }

    createPreviewImage = async (
        _: Event,
        image: FilmImage,
    ): Promise<IPCResult<string>> => {
        const tmpFolder = await this.imageProcessing.getTmpFolder();

        const previewPath = join(tmpFolder, `${image.id}.jpg`);
        if ((await this.previewExists(previewPath)) === false) {
            await this.imageProcessing.transformToJPG(image.path, previewPath);
        }

        return { ok: true, result: previewPath };
    };

    private async previewExists(path: string): Promise<boolean> {
        try {
            await fs.access(path, constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }
}
