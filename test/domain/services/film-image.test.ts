import electron from "electron";
import { join } from "path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mock } from "vitest-mock-extended";
import { IImageProcessing } from "../../../src/domain/ports/image-processing";
import FilmImageService from "../../../src/domain/services/film-image";
import { CREATE_IMAGE_PREVIEW_HANDLER } from "../../../src/infra/ipc-events";
import {
    createDummyFile,
    createTemporalDirectory,
    removeDirectory,
} from "../../test-util/file-system";
import { anImage } from "../../test-util/fixtures";

const EVENT = {} as electron.IpcMainInvokeEvent;
let tmpDir: string;

beforeEach(() => {
    tmpDir = createTemporalDirectory();
});

afterEach(() => {
    removeDirectory(tmpDir);
});

describe("Film Image Service", () => {
    describe("Create Image Preview", () => {
        it("Should create a tmp folder and store a jpg version of the image", async () => {
            const imageProcessing = mock<IImageProcessing>();
            const service = new FilmImageService(imageProcessing);
            const inputPath = "/input/path.tif";
            const image = anImage({
                path: inputPath,
                name: "path",
            });

            imageProcessing.getTmpFolder.mockResolvedValue(tmpDir);

            const previewPath = await service.createPreviewImage(EVENT, image);

            expect(imageProcessing.getTmpFolder).toHaveBeenCalledOnce();
            expect(previewPath).toEqual({
                ok: true,
                result: join(tmpDir, `${image.id}.jpg`),
            });
            expect(imageProcessing.transformToJPG).toHaveBeenCalledWith(
                inputPath,
                previewPath.ok && previewPath.result,
            );
        });

        it("Should not transform the image if it already exists", async () => {
            const imageProcessing = mock<IImageProcessing>();
            const service = new FilmImageService(imageProcessing);
            const inputPath = "/input/path.tif";
            const image = anImage({
                path: inputPath,
                name: "path",
            });
            createDummyFile(tmpDir, `${image.id}.jpg`);

            imageProcessing.getTmpFolder.mockResolvedValue(tmpDir);

            const previewPath = await service.createPreviewImage(EVENT, image);

            expect(imageProcessing.getTmpFolder).toHaveBeenCalledOnce();
            expect(previewPath).toEqual({
                ok: true,
                result: join(tmpDir, `${image.id}.jpg`),
            });
            expect(imageProcessing.transformToJPG).not.toHaveBeenCalled();
        });
    });

    it("Should load IPC handlers", () => {
        const imageProcessing = mock<IImageProcessing>();
        const filmImageService = new FilmImageService(imageProcessing);
        const ipcMain = mock<electron.IpcMain>();

        filmImageService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            CREATE_IMAGE_PREVIEW_HANDLER,
            filmImageService.createPreviewImage,
        );
    });
});
