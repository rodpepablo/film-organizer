import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mock } from "vitest-mock-extended";
import { join } from "path";
import fs from "fs/promises";
import packageJSON from "../../../package.json";
import electron, { IpcMainInvokeEvent } from "electron";
import CollectionService from "../../../src/domain/services/collection";
import {
    createTemporalDirectory,
    loadJSON,
    saveJSON,
    removeDirectory,
    createFolder,
    createDummyFile,
} from "../../test-util/file-system";
import { Collection } from "../../../src/domain/models/collection";
import {
    LOAD_COLLECTION_HANDLER,
    CREATE_COLLECTION_HANDLER,
    SAVE_COLLECTION_HANDLER,
} from "../../../src/infra/ipc-events";
import { aFilm, aCollection, anImage } from "../../test-util/fixtures";
import { IPCErrors } from "../../../src/infra/ipc-service";
import { IMigrationManager } from "../../../src/infra/migration-manager";

const NAME = "collection_name";

const EVENT = {} as IpcMainInvokeEvent;
let temporalDirectory: string;
const migrationMock = mock<IMigrationManager>();

beforeEach(() => {
    temporalDirectory = createTemporalDirectory();
    migrationMock.applyMigrations.mockReset();
});

afterEach(() => {
    removeDirectory(temporalDirectory);
});

describe("CollectionService", () => {
    const collectionService = new CollectionService(migrationMock);

    it("Should create a collection in a designated file", async () => {
        const createdCollection = await collectionService.createCollection(
            EVENT,
            temporalDirectory,
            NAME,
        );

        const expectedCollection = {
            app: packageJSON.name,
            version: packageJSON.version,
            name: NAME,
            path: join(temporalDirectory, `${NAME}.json`),
            films: [],
        };

        expect(createdCollection).toStrictEqual(expectedCollection);
        const savedCollection = loadJSON<Collection>(expectedCollection.path);
        expect(savedCollection).toStrictEqual(expectedCollection);
    });

    describe("Load a collection", () => {
        it("Should raise an error if collection doesnt follow the contract", async () => {
            const fullpath = join(temporalDirectory, "test.json");
            const wrongCollection = { app: "invalid-save", wrong: "value" };
            saveJSON(fullpath, wrongCollection);

            const result = await collectionService.loadCollection(EVENT, fullpath);

            expect(result).toStrictEqual({
                ok: false,
                type: IPCErrors.INVALID_COLLECTION_FILE,
            });
        });

        it("Should perform migrations if collection is valid and save file", async () => {
            const fullpath = join(temporalDirectory, "test.json");
            const outdatedCollection = aCollection({
                version: "0.0.0",
                path: "/last/path.json",
            });
            const migratedCollection = aCollection({
                ...outdatedCollection,
                version: "0.0.1",
                path: fullpath,
            });
            saveJSON(fullpath, outdatedCollection);

            migrationMock.applyMigrations.mockReturnValue(migratedCollection);

            const result = await collectionService.loadCollection(EVENT, fullpath);

            expect(migrationMock.applyMigrations).toHaveBeenCalledWith({
                ...outdatedCollection,
                path: fullpath,
            });
            expect(result).toStrictEqual({
                ok: true,
                result: migratedCollection,
            });
            expect(loadJSON(fullpath)).toStrictEqual(migratedCollection);
        });

        it("Should raise an error if migrated collection doesnt follow the contract", async () => {
            const fullpath = join(temporalDirectory, "test.json");
            const outdatedCollection = aCollection({
                version: "0.0.0",
            });
            const migratedCollection = {
                ...outdatedCollection,
                version: "1.0.0",
                path: fullpath,
                name: 123,
            };
            saveJSON(fullpath, outdatedCollection);

            migrationMock.applyMigrations.mockReturnValue(
                migratedCollection as unknown as Collection,
            );

            const result = await collectionService.loadCollection(EVENT, fullpath);

            expect(migrationMock.applyMigrations).toHaveBeenCalledWith({
                ...outdatedCollection,
                path: fullpath,
            });
            expect(result).toStrictEqual({
                ok: false,
                type: IPCErrors.INVALID_COLLECTION_FILE,
            });
        });

        it("Should not run migration if collection version is currect version", async () => {
            const fullpath = join(temporalDirectory, "test.json");
            const collection = aCollection();
            saveJSON(fullpath, collection);

            const result = await collectionService.loadCollection(EVENT, fullpath);

            expect(result).toStrictEqual({
                ok: true,
                result: collection,
            });
            expect(migrationMock.applyMigrations).not.toHaveBeenCalled();
        });
    });

    describe("Save Collection", () => {
        it("Should save a collection", async () => {
            const collectionPath = join(temporalDirectory, "test.json");
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
            const previousCollection = aCollection({
                path: collectionPath,
                films: [film],
            });

            saveJSON(collectionPath, previousCollection);
            createFolder(temporalDirectory, "film");
            createDummyFile(temporalDirectory, "film", "image1.tif");
            createDummyFile(temporalDirectory, "film", "image2.jpg");

            const imageWithPreview = anImage({
                ...image1,
                previewPath: "/preview/path.jpg",
            });
            const renamedImage = anImage({
                ...image2,
                name: "renamed",
            });
            const collection = aCollection({
                ...previousCollection,
                name: "new_name",
                path: collectionPath,
                films: [aFilm({ ...film, images: [imageWithPreview, renamedImage] })],
            });

            const savedCollection = await collectionService.saveCollection(
                EVENT,
                collection,
            );

            const expectedCollection = aCollection({
                ...collection,
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
            expect(loadJSON(collectionPath)).toStrictEqual(expectedCollection);
            expect(savedCollection).toStrictEqual(expectedCollection);
            const savedImages = await fs.readdir(join(temporalDirectory, "film"));
            expect(savedImages).toHaveLength(2);
            expect(savedImages).toContain("image1.tif");
            expect(savedImages).toContain("renamed.jpg");
        });

        it("Swaping names between images should not raise an error on os renaming", async () => {
            const collectionPath = join(temporalDirectory, "test.json");
            const image1 = anImage({
                name: "image1",
                ext: "jpg",
                path: join(temporalDirectory, "film", "image1.jpg"),
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
            const previousCollection = aCollection({
                path: collectionPath,
                films: [film],
            });

            saveJSON(collectionPath, previousCollection);
            createFolder(temporalDirectory, "film");
            createDummyFile(temporalDirectory, "film", "image1.jpg");
            createDummyFile(temporalDirectory, "film", "image2.jpg");

            const renamedImage1 = anImage({
                ...image1,
                name: "image2",
            });

            const renamedImage2 = anImage({
                ...image2,
                name: "image1",
            });
            const collection = aCollection({
                ...previousCollection,
                films: [
                    aFilm({
                        ...film,
                        images: [renamedImage1, renamedImage2],
                    }),
                ],
            });

            const savedCollection = await collectionService.saveCollection(
                EVENT,
                collection,
            );

            const expectedCollection = aCollection({
                ...collection,
                films: [
                    aFilm({
                        ...film,
                        images: [
                            anImage({
                                ...renamedImage1,
                                path: join(temporalDirectory, "film", "image2.jpg"),
                            }),
                            anImage({
                                ...renamedImage2,
                                path: join(temporalDirectory, "film", "image1.jpg"),
                            }),
                        ],
                    }),
                ],
            });
            expect(loadJSON(collectionPath)).toStrictEqual(expectedCollection);
            expect(savedCollection).toStrictEqual(expectedCollection);
            const savedImages = await fs.readdir(join(temporalDirectory, "film"));
            expect(savedImages).toHaveLength(2);
            expect(savedImages).toContain("image1.jpg");
            expect(savedImages).toContain("image2.jpg");
        });
    });

    it("Should load IPC handlers", () => {
        const ipcMain = mock<electron.IpcMain>();

        collectionService.load(ipcMain);

        expect(ipcMain.handle).toHaveBeenCalledWith(
            CREATE_COLLECTION_HANDLER,
            collectionService.createCollection,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            LOAD_COLLECTION_HANDLER,
            collectionService.loadCollection,
        );
        expect(ipcMain.handle).toHaveBeenCalledWith(
            SAVE_COLLECTION_HANDLER,
            collectionService.saveCollection,
        );
    });
});
