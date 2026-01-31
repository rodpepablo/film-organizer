import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import Nanobus from "nanobus";
import {
    ADD_FILM_REQUEST,
    CREATE_NOTIFICATION,
} from "../../../src/infra/events";
import { State } from "../../../src/domain/models/state";
import { filmStore, FilmStoreManager } from "../../../src/domain/stores/film";
import { anAlbum } from "../../test-util/fixtures";
import { expectRender, mockedAPI, spiedBus } from "../../test-util/mocking";
import {
    FILM_ADDITION_SUCCESS,
    FILM_NOT_IN_ALBUM_ERROR,
    UNEXPECTED_ERROR,
} from "../../../src/infra/constants";
import { IPCErrors } from "../../../src/infra/ipc-service";

const ALBUM_PATH = "/path";
const FILM_PATH = "/path/to/film";

const ALBUM = anAlbum({ path: ALBUM_PATH });

describe("Film store", () => {
    it("Should add a film from request", async () => {
        const film = {
            name: "film",
            path: "film",
            images: [{ name: "image", ext: "tif", path: "/path/to/film/image.tif" }],
        };
        const state = { album: ALBUM };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new FilmStoreManager(state, bus, api);

        api.fs.getFolder.mockResolvedValue(FILM_PATH);
        api.film.addFilm.mockResolvedValue({ ok: true, result: film });

        await manager.manageAddFilm();

        expect(state.album).toStrictEqual({
            ...ALBUM,
            films: [film],
        });
        expect(api.fs.getFolder).toHaveBeenCalledOnce();
        expect(api.film.addFilm).toHaveBeenCalledWith(ALBUM_PATH, FILM_PATH);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            FILM_ADDITION_SUCCESS,
        );
        expectRender(bus);
    });

    it("Shouldn't do anything if folder selection is cancelled", async () => {
        const state = { album: ALBUM };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new FilmStoreManager(state, bus, api);

        api.fs.getFolder.mockResolvedValue(null);

        await manager.manageAddFilm();

        expect(state.album).toStrictEqual(ALBUM);
        expect(api.fs.getFolder).toHaveBeenCalledOnce();
        expect(api.film.addFilm).not.toHaveBeenCalled();
        expect(bus.emit).not.toHaveBeenCalled();
    });

    it("Should create an error notification if film path not inside album", async () => {
        const state = { album: ALBUM };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new FilmStoreManager(state, bus, api);

        api.fs.getFolder.mockResolvedValue(FILM_PATH);
        api.film.addFilm.mockResolvedValue({
            ok: false,
            type: IPCErrors.FILM_FOLDER_OUTSIDE_ALBUM_FOLDER,
        });

        await manager.manageAddFilm();

        expect(state.album).toStrictEqual(ALBUM);
        expect(api.fs.getFolder).toHaveBeenCalledOnce();
        expect(api.film.addFilm).toHaveBeenCalledWith(ALBUM_PATH, FILM_PATH);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            FILM_NOT_IN_ALBUM_ERROR,
        );
        expectRender(bus);
    });

    it("Should create an error notification on runtime error", async () => {
        const state = { album: ALBUM };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new FilmStoreManager(state, bus, api);

        api.fs.getFolder.mockResolvedValue(FILM_PATH);
        api.film.addFilm.mockRejectedValue(new Error());

        await manager.manageAddFilm();

        expect(state.album).toStrictEqual(ALBUM);
        expect(api.fs.getFolder).toHaveBeenCalledOnce();
        expect(api.film.addFilm).toHaveBeenCalledWith(ALBUM_PATH, FILM_PATH);
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            UNEXPECTED_ERROR,
        );
        expectRender(bus);
    });

    it("Should register handlers", () => {
        const emitter = mock<Nanobus>();

        filmStore({} as State, emitter);

        const events = [ADD_FILM_REQUEST];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});
