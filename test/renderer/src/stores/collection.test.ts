import { describe, it, expect } from "vitest";
import { join } from "path";
import Nanobus from "nanobus";
import { mock } from "vitest-mock-extended";
import {
    collectionStore,
    CollectionStoreManager,
} from "../../../../src/renderer/src/stores/collection";
import {
    COLLECTION_CREATION_SUCCESS,
    COLLECTION_LOAD_ERROR,
    COLLECTION_LOAD_SUCCESS,
    COLLECTION_SAVE_SUCCESS,
    CREATE_COLLECTION_FORM,
    FILM_SECTION,
    UNEXPECTED_ERROR,
} from "../../../../src/infra/constants";
import { INVALID_COLLECTION_NAME } from "../../../../src/infra/errors";
import {
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_COLLECTION_REQUEST,
    CREATE_NOTIFICATION,
    FORM_ERROR,
    LOAD_COLLECTION_REQUEST,
    NAVIGATE,
    SAVE_COLLECTION_REQUEST,
    SORT_FILM_LIST,
} from "../../../../src/infra/events";
import { expectRender, mockedAPI, spiedBus } from "../../../test-util/mocking";
import { State } from "../../../../src/domain/models/state";
import {
    aFilm,
    aForm,
    aCollection,
    anImage,
} from "../../../test-util/fixtures";
import { IPCErrors } from "../../../../src/infra/ipc-service";

const COLLECTION_NAME = "COLLECTION_NAME";
const FOLDER_PATH = "/PATH";
const FILE_PATH = "/PATH/TO/FILE.json";

describe("Collection store", () => {
    describe("Create collection", () => {
        it("Should create collection from request", async () => {
            const state = {
                collection: null,
                forms: {
                    [CREATE_COLLECTION_FORM]: aForm({
                        values: { name: COLLECTION_NAME },
                    }),
                },
            };
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);
            const expectedCollection = aCollection({
                name: COLLECTION_NAME,
                path: join(FOLDER_PATH, `${COLLECTION_NAME}.json`),
            });

            api.fs.getFolder.mockResolvedValue(FOLDER_PATH);
            api.collection.createCollection.mockResolvedValue(expectedCollection);

            await manager.manageCreateCollection();

            expect(state.collection).toStrictEqual(expectedCollection);
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: CREATE_COLLECTION_FORM,
            });
            expect(api.collection.createCollection).toHaveBeenCalledWith(
                FOLDER_PATH,
                COLLECTION_NAME,
            );
            expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                COLLECTION_CREATION_SUCCESS,
            );
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
                formId: CREATE_COLLECTION_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(NAVIGATE, { to: [FILM_SECTION] });
            expectRender(bus);
        });

        it("Should add an error to the form when invalid", async () => {
            const state = {
                collection: null,
                forms: {
                    [CREATE_COLLECTION_FORM]: aForm({
                        values: { name: "" },
                    }),
                },
            };
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);

            await manager.manageCreateCollection();

            expect(state.collection).toBeNull();
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: CREATE_COLLECTION_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
                formId: CREATE_COLLECTION_FORM,
                error: INVALID_COLLECTION_NAME,
            });
        });

        it("Should clear error and do nothing when the folder dialog is cancelled", async () => {
            const state = {
                collection: null,
                forms: {
                    [CREATE_COLLECTION_FORM]: aForm({
                        values: { name: COLLECTION_NAME },
                    }),
                },
            };
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);

            api.fs.getFolder.mockResolvedValue(null);

            await manager.manageCreateCollection();

            expect(state.collection).toBeNull();
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: CREATE_COLLECTION_FORM,
            });
            expect(bus.emit).not.toHaveBeenCalledWith(CLOSE_MODAL);
            expect(bus.emit).not.toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                expect.any(String),
            );
            expectRender(bus);
        });
    });

    describe("Load collection", () => {
        it("Should load an collection if selected", async () => {
            const state = { collection: null } as State;
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);
            const expectedCollection = aCollection({
                name: COLLECTION_NAME,
                path: FILE_PATH,
            });

            api.fs.getFile.mockResolvedValue(FILE_PATH);
            api.collection.loadCollection.mockResolvedValue({
                ok: true,
                result: expectedCollection,
            });

            await manager.manageLoadCollection();

            expect(state.collection).toStrictEqual(expectedCollection);
            expect(api.fs.getFile).toHaveBeenCalledWith();
            expect(api.collection.loadCollection).toHaveBeenCalledWith(FILE_PATH);
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                COLLECTION_LOAD_SUCCESS,
            );
            expect(bus.emit).toHaveBeenCalledWith(NAVIGATE, { to: [FILM_SECTION] });
            expectRender(bus);
        });

        it("Should not render or change collection on file selection cancel", async () => {
            const currentCollection = aCollection({ name: "current_collection" });
            const state = { collection: currentCollection, forms: {} };
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);

            api.fs.getFile.mockResolvedValue(null);

            await manager.manageLoadCollection();

            expect(state.collection).toStrictEqual(currentCollection);
            expect(api.fs.getFile).toHaveBeenCalledWith();
            expect(api.collection.loadCollection).not.toHaveBeenCalled();
            expect(bus.emit).not.toHaveBeenCalledWith("render");
        });

        it("Should not render and should show an error if the file is non-compliant", async () => {
            const state = { collection: null, forms: {} };
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);

            api.fs.getFile.mockResolvedValue(FILE_PATH);
            api.collection.loadCollection.mockResolvedValue({
                ok: false,
                type: IPCErrors.INVALID_COLLECTION_FILE,
            });

            await manager.manageLoadCollection();

            expect(state.collection).toStrictEqual(null);
            expect(api.fs.getFile).toHaveBeenCalledWith();
            expect(api.collection.loadCollection).toHaveBeenCalledWith(FILE_PATH);
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                COLLECTION_LOAD_ERROR,
            );
            expectRender(bus);
        });
    });

    describe("Save collection", () => {
        it("Should save the changes to the collection and replace state with postprocess collection", async () => {
            const renamed = anImage({
                name: "renamed",
                ext: "jpg",
                path: "/path/to/image1.jpg",
            });
            const savedImage = anImage({
                ...renamed,
                name: "renamed",
                path: "/path/to/renamed.jpg",
            });
            const film = aFilm({ images: [renamed] });
            const collection = aCollection({ films: [film] });
            const state = { collection, forms: {} };
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);

            const expectedCollection = aCollection({
                ...collection,
                films: [aFilm({ ...film, images: [savedImage] })],
            });
            api.collection.saveCollection.mockResolvedValue(expectedCollection);

            await manager.manageSaveCollection();

            expect(api.collection.saveCollection).toHaveBeenCalledWith(collection);
            expect(state.collection).toStrictEqual(expectedCollection);
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                COLLECTION_SAVE_SUCCESS,
            );
            expectRender(bus);
        });

        it("Should notify about errors saving collection", async () => {
            const collection = aCollection();
            const state = { collection, forms: {} };
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new CollectionStoreManager(state, bus, api);

            api.collection.saveCollection.mockRejectedValue(new Error());

            await manager.manageSaveCollection();

            expect(api.collection.saveCollection).toHaveBeenCalledWith(collection);
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
        });
    });

    it("Should change the film list to reflect the new order", () => {
        const film1 = aFilm();
        const film2 = aFilm();
        const film3 = aFilm();
        const state = {
            collection: aCollection({ films: [film1, film2, film3] }),
        } as State;
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new CollectionStoreManager(state, bus, api);

        const newOrder = [film3.id, film1.id, film2.id];
        manager.manageSortFilmList({ newOrder });

        expect(state.collection?.films.map((film) => film.id)).toEqual(newOrder);
        expectRender(bus);
    });

    it("Should register handlers", () => {
        const emitter = mock<Nanobus>();

        collectionStore({} as State, emitter);

        const events = [
            CREATE_COLLECTION_REQUEST,
            LOAD_COLLECTION_REQUEST,
            SAVE_COLLECTION_REQUEST,
            SORT_FILM_LIST,
        ];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});
