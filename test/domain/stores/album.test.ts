import { describe, it, expect } from "vitest";
import { join } from "path";
import Nanobus from "nanobus";
import { mock } from "vitest-mock-extended";
import "../../../src/preload-types";
import {
    albumStore,
    AlbumStoreManager,
} from "../../../src/domain/stores/album";
import {
    ALBUM_CREATION_SUCCESS,
    ALBUM_LOAD_ERROR,
    ALBUM_LOAD_SUCCESS,
    ALBUM_SAVE_SUCCESS,
    CREATE_ALBUM_FORM,
    FILM_SECTION,
    UNEXPECTED_ERROR,
} from "../../../src/infra/constants";
import { INVALID_ALBUM_NAME } from "../../../src/infra/errors";
import {
    CLEAR_FORM,
    CLOSE_MODAL,
    CREATE_ALBUM_REQUEST,
    CREATE_NOTIFICATION,
    FORM_ERROR,
    LOAD_ALBUM_REQUEST,
    NAVIGATE,
    SAVE_ALBUM_REQUEST,
} from "../../../src/infra/events";
import { expectRender, mockedAPI, spiedBus } from "../../test-util/mocking";
import { Album } from "../../../src/domain/models/album";
import { State } from "../../../src/domain/models/state";
import { aForm, anAlbum } from "../../test-util/fixtures";

const ALBUM_NAME = "ALBUM_NAME";
const FOLDER_PATH = "/PATH";
const FILE_PATH = "/PATH/TO/FILE.json";

describe("Album store", () => {
    it("Should create album from request", async () => {
        const state = {
            album: null,
            forms: {
                [CREATE_ALBUM_FORM]: aForm({ values: { name: ALBUM_NAME } }),
            },
        };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);
        const expectedAlbum = anAlbum({
            name: ALBUM_NAME,
            path: join(FOLDER_PATH, `${ALBUM_NAME}.json`),
        });

        api.fs.getFolder.mockResolvedValue(FOLDER_PATH);
        api.album.createAlbum.mockResolvedValue(expectedAlbum);

        await manager.manageCreateAlbum();

        expect(state.album).toStrictEqual(expectedAlbum);
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            form: CREATE_ALBUM_FORM,
        });
        expect(api.album.createAlbum).toHaveBeenCalledWith(FOLDER_PATH, ALBUM_NAME);
        expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            ALBUM_CREATION_SUCCESS,
        );
        expect(bus.emit).toHaveBeenCalledWith(NAVIGATE, { to: [FILM_SECTION] });
        expectRender(bus);
    });

    it("Should add an error to the form when invalid", async () => {
        const state = {
            album: null,
            forms: {
                [CREATE_ALBUM_FORM]: aForm({
                    values: { name: "" },
                }),
            },
        };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);

        await manager.manageCreateAlbum();

        expect(state.album).toBeNull();
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            form: CREATE_ALBUM_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
            form: CREATE_ALBUM_FORM,
            error: INVALID_ALBUM_NAME,
        });
    });

    it("Should close the modal and do nothing when the folder dialog is cancelled", async () => {
        const state = {
            album: null,
            forms: {
                [CREATE_ALBUM_FORM]: aForm({
                    values: { name: ALBUM_NAME },
                }),
            },
        };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);

        api.fs.getFolder.mockResolvedValue(null);

        await manager.manageCreateAlbum();

        expect(state.album).toBeNull();
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            form: CREATE_ALBUM_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
        expect(bus.emit).not.toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            expect.any(String),
        );
        expectRender(bus);
    });

    it("Should load an album if selected", async () => {
        const state = { album: null };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);
        const expectedAlbum = anAlbum({ name: ALBUM_NAME, path: FILE_PATH });

        api.fs.getFile.mockResolvedValue(FILE_PATH);
        api.album.loadAlbum.mockResolvedValue(expectedAlbum);

        await manager.manageLoadAlbum();

        expect(state.album).toStrictEqual(expectedAlbum);
        expect(api.fs.getFile).toHaveBeenCalledWith();
        expect(api.album.loadAlbum).toHaveBeenCalledWith(FILE_PATH);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            ALBUM_LOAD_SUCCESS,
        );
        expect(bus.emit).toHaveBeenCalledWith(NAVIGATE, { to: [FILM_SECTION] });
        expectRender(bus);
    });

    it("Should not render or change album on file selection cancel", async () => {
        const currentAlbum = anAlbum({ name: "current_album" });
        const state = { album: currentAlbum, forms: {} };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);

        api.fs.getFile.mockResolvedValue(null);

        await manager.manageLoadAlbum();

        expect(state.album).toStrictEqual(currentAlbum);
        expect(api.fs.getFile).toHaveBeenCalledWith();
        expect(api.album.loadAlbum).not.toHaveBeenCalled();
        expect(bus.emit).not.toHaveBeenCalledWith("render");
    });

    it("Should not render and should show an error if the file is non-compliant", async () => {
        const state = { album: null, forms: {} };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);

        api.fs.getFile.mockResolvedValue(FILE_PATH);
        api.album.loadAlbum.mockResolvedValue({ invalid: 3 } as unknown as Album);

        await manager.manageLoadAlbum();

        expect(state.album).toStrictEqual(null);
        expect(api.fs.getFile).toHaveBeenCalledWith();
        expect(api.album.loadAlbum).toHaveBeenCalledWith(FILE_PATH);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            ALBUM_LOAD_ERROR,
        );
        expectRender(bus);
    });

    it("Should save the changes to the album", async () => {
        const album = anAlbum();
        const state = { album, forms: {} };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);

        await manager.manageSaveAlbum();

        expect(api.album.saveAlbum).toHaveBeenCalledWith(album);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            ALBUM_SAVE_SUCCESS,
        );
    });

    it("Should notify about errors saving album", async () => {
        const album = anAlbum();
        const state = { album, forms: {} };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new AlbumStoreManager(state, bus, api);

        api.album.saveAlbum.mockRejectedValue(new Error());

        await manager.manageSaveAlbum();

        expect(api.album.saveAlbum).toHaveBeenCalledWith(album);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            UNEXPECTED_ERROR,
        );
    });

    it("Should register handlers", () => {
        const emitter = mock<Nanobus>();

        albumStore({} as State, emitter);

        const events = [
            CREATE_ALBUM_REQUEST,
            LOAD_ALBUM_REQUEST,
            SAVE_ALBUM_REQUEST,
        ];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});
