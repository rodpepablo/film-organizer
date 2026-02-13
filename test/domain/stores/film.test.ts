import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import Nanobus from "nanobus";
import {
    ADD_FILM_REQUEST,
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    EDIT_FILM_NAME_REQUEST,
    FORM_ERROR,
} from "../../../src/infra/events";
import { State } from "../../../src/domain/models/state";
import { filmStore, FilmStoreManager } from "../../../src/domain/stores/film";
import { aFilm, aForm, anAlbum } from "../../test-util/fixtures";
import { expectRender, mockedAPI, spiedBus } from "../../test-util/mocking";
import {
    EDIT_FILM_NAME_FORM,
    FILM_ADDITION_SUCCESS,
    FILM_NAME_EDIT_SUCCESS,
    FILM_NOT_IN_ALBUM_ERROR,
    UNEXPECTED_ERROR,
} from "../../../src/infra/constants";
import { IPCErrors } from "../../../src/infra/ipc-service";

const ALBUM_PATH = "/path";
const FILM_PATH = "/path/to/film";

const ALBUM = anAlbum({ path: ALBUM_PATH });

describe("Film store", () => {
    it("Should add a film from request", async () => {
        const film = aFilm();
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

    it("Should edit film name and create a notification", () => {
        const film = aFilm({ name: "old name" });
        const state = {
            album: anAlbum({ films: [film] }),
            forms: {
                [EDIT_FILM_NAME_FORM]: aForm({
                    values: { filmId: film.id, name: "new name" },
                }),
            },
        };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new FilmStoreManager(state, bus, api);

        manager.editFilmName();

        expect(state.album.films[0].name).toEqual("new name");
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
            formId: EDIT_FILM_NAME_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            FILM_NAME_EDIT_SUCCESS,
        );
        expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            formId: EDIT_FILM_NAME_FORM,
        });
        expectRender(bus);
    });

    it("Should put an error into the form if name is invalid", () => {
        const film = aFilm({ name: "old name" });
        const state = {
            album: anAlbum({ films: [film] }),
            forms: {
                [EDIT_FILM_NAME_FORM]: aForm({
                    values: { filmId: film.id, name: "" },
                }),
            },
        };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new FilmStoreManager(state, bus, api);

        manager.editFilmName();

        expect(state.album.films[0].name).toEqual("old name");
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
            formId: EDIT_FILM_NAME_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
            formId: EDIT_FILM_NAME_FORM,
            error: expect.any(String),
        });
        expectRender(bus);
    });

    it("Should close the form and create a notification on error", () => {
        const state = {
            album: anAlbum(),
            forms: {
                [EDIT_FILM_NAME_FORM]: aForm({
                    values: { formId: "123", name: "new name" },
                }),
            },
        };
        const bus = spiedBus();
        const api = mockedAPI();
        const manager = new FilmStoreManager(state, bus, api);

        manager.editFilmName();

        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
            formId: EDIT_FILM_NAME_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(
            CREATE_NOTIFICATION,
            UNEXPECTED_ERROR,
        );
        expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            formId: EDIT_FILM_NAME_FORM,
        });
        expectRender(bus);
    });

    it("Should register handlers", () => {
        const emitter = mock<Nanobus>();

        filmStore({} as State, emitter);

        const events = [ADD_FILM_REQUEST, EDIT_FILM_NAME_REQUEST];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});
