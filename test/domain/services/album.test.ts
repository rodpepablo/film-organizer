import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mock } from "vitest-mock-extended";
import { join } from "path";
import fs from "fs/promises";
import electron, { IpcMainInvokeEvent } from "electron";
import AlbumService from "../../../src/domain/services/album";
import {
    createTemporalDirectory,
    loadJSON,
    saveJSON,
    removeDirectory,
    createFolder,
    createDummyFile,
} from "../../test-util/file-system";
import { Album } from "../../../src/domain/models/album";
import {
    LOAD_ALBUM_HANDLER,
    CREATE_ALBUM_HANDLER,
    SAVE_ALBUM_HANDLER,
} from "../../../src/infra/ipc-events";
import { aFilm, anAlbum, anImage } from "../../test-util/fixtures";

const NAME = "album_name";

const EVENT = {} as IpcMainInvokeEvent;
let temporalDirectory: string;

beforeEach(() => {
    temporalDirectory = createTemporalDirectory();
});

afterEach(() => {
    removeDirectory(temporalDirectory);
});

describe("AlbumService", () => {
    it("Should create an album in a designated file", async () => {
        const albumService = new AlbumService();

        const createdAlbum = await albumService.createAlbum(
            EVENT,
            temporalDirectory,
            NAME,
        );

        const expectedAlbum = {
            name: NAME,
            path: join(temporalDirectory, `${NAME}.json`),
            films: [],
        };

        expect(createdAlbum).toStrictEqual(expectedAlbum);
        const savedAlbum = loadJSON<Album>(expectedAlbum.path);
        expect(savedAlbum).toStrictEqual(expectedAlbum);
    });

    it("Should load an album from a designated path", async () => {
        const fullpath = join(temporalDirectory, "test.json");
        const savedAlbum = anAlbum({ path: "/last/path.json" });
        saveJSON(fullpath, savedAlbum);

        const albumService = new AlbumService();

        const album = await albumService.loadAlbum(EVENT, fullpath);

        expect(album).toStrictEqual(
            anAlbum({
                ...savedAlbum,
                path: fullpath,
            }),
        );
    });

    it("Should save an album", async () => {
        const albumPath = join(temporalDirectory, "test.json");
        const image1 = anImage({
            name: "image1",
            ext: "tif",
            path: join(temporalDirectory, "film", "image1.tif"),
        });
        const image2 = anImage({
            name: "image2",
            ext: "jpg",
            path: join(temporalDirectory, "film", "image2.jpg"),
        });
        const film = aFilm({
            name: "film",
            path: "film",
            images: [image1, image2],
        });
        const previousAlbum = anAlbum({ path: albumPath, films: [film] });

        saveJSON(albumPath, previousAlbum);
        createFolder(temporalDirectory, "film");
        createDummyFile(temporalDirectory, "film", "image1.tif");
        createDummyFile(temporalDirectory, "film", "image2.jpg");

        const albumService = new AlbumService();

        const imageWithPreview = anImage({
            ...image1,
            previewPath: "/preview/path.jpg",
        });
        const renamedImage = anImage({
            ...image2,
            name: "renamed",
        });
        const album = anAlbum({
            ...previousAlbum,
            name: "new_name",
            path: albumPath,
            films: [aFilm({ ...film, images: [imageWithPreview, renamedImage] })],
        });

        const savedAlbum = await albumService.saveAlbum(EVENT, album);

        const expectedAlbum = anAlbum({
            ...album,
            films: [
                aFilm({
                    ...film,
                    images: [
                        anImage({
                            ...imageWithPreview,
                            previewPath: null,
                        }),
                        anImage({
                            ...renamedImage,
                            path: join(temporalDirectory, "film", "renamed.jpg"),
                        }),
                    ],
                }),
            ],
        });
        expect(loadJSON(albumPath)).toStrictEqual(expectedAlbum);
        expect(savedAlbum).toStrictEqual(expectedAlbum);
        const savedImages = await fs.readdir(join(temporalDirectory, "film"));
        expect(savedImages).toHaveLength(2);
        expect(savedImages).toContain("image1.tif");
        expect(savedImages).toContain("renamed.jpg");
    });

    it("Should load IPC handlers", () => {
        const albumService = new AlbumService();
        const ipcMain = mock<electron.IpcMain>();

        albumService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            CREATE_ALBUM_HANDLER,
            albumService.createAlbum,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            LOAD_ALBUM_HANDLER,
            albumService.loadAlbum,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            SAVE_ALBUM_HANDLER,
            albumService.saveAlbum,
        );
    });
});
