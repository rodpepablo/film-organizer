import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import Nanobus from "nanobus";
import {
    ADD_FILM_REQUEST,
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    EDIT_FILM_INFO_REQUEST,
    EDIT_FILM_NAME_REQUEST,
    FORM_ERROR,
    OPEN_MODAL,
    SORT_IMAGE_LIST,
} from "../../../src/infra/events";
import { State } from "../../../src/domain/models/state";
import { filmStore, FilmStoreManager } from "../../../src/domain/stores/film";
import {
    aFilm,
    aFilmInfo,
    aForm,
    anAlbum,
    anImage,
    aState,
} from "../../test-util/fixtures";
import { expectRender, mockedAPI, spiedBus } from "../../test-util/mocking";
import {
    EDIT_FILM_INFO_FORM,
    EDIT_FILM_INFO_SUCCESS,
    EDIT_FILM_NAME_FORM,
    FILM_ADDITION_SUCCESS,
    FILM_INFO_MODAL,
    FILM_NAME_EDIT_SUCCESS,
    FILM_NOT_IN_ALBUM_ERROR,
    UNEXPECTED_ERROR,
} from "../../../src/infra/constants";
import { IPCErrors } from "../../../src/infra/ipc-service";
import { INVALID_SHOT_ISO } from "../../../src/infra/errors";

const ALBUM_PATH = "/path";
const FILM_PATH = "/path/to/film";

const ALBUM = anAlbum({ path: ALBUM_PATH });

describe("Film store", () => {
    describe("Add film", () => {
        it("Should add a film from request", async () => {
            const film = aFilm();
            const state = aState({ album: ALBUM });
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
            const state = aState({ album: ALBUM });
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
            const state = aState({ album: ALBUM });
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
            const state = aState({ album: ALBUM });
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
    });

    describe("Edit film name", () => {
        it("Should edit film name and create a notification", () => {
            const film = aFilm({ name: "old name" });
            const state = aState({
                album: anAlbum({ films: [film] }),
                forms: {
                    [EDIT_FILM_NAME_FORM]: aForm({
                        values: { filmId: film.id, name: "new name" },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmStoreManager(state, bus, api);

            manager.editFilmName();

            expect(state.album?.films[0].name).toEqual("new name");
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
            const state = aState({
                album: anAlbum({ films: [film] }),
                forms: {
                    [EDIT_FILM_NAME_FORM]: aForm({
                        values: { filmId: film.id, name: "" },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmStoreManager(state, bus, api);

            manager.editFilmName();

            expect(state.album?.films[0].name).toEqual("old name");
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
            const state = aState({
                album: anAlbum(),
                forms: {
                    [EDIT_FILM_NAME_FORM]: aForm({
                        values: { formId: "123", name: "new name" },
                    }),
                },
            });
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
    });

    describe("Sort image list", () => {
        it("Should sort image list according to new order", () => {
            const image1 = anImage();
            const image2 = anImage();
            const image3 = anImage();
            const film = aFilm({ images: [image1, image2, image3] });
            const state = aState({
                album: anAlbum({ films: [aFilm(), film] }),
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmStoreManager(state, bus, api);

            const newOrder = [image2.id, image1.id, image3.id];
            manager.sortImageList({ filmId: film.id, newOrder });

            expect(state.album?.films[1].images.map((image) => image.id)).toEqual(
                newOrder,
            );
            expectRender(bus);
        });

        it("Should show an error notification on unexpected behaviour (film doesnt exist)", () => {
            const film = aFilm();
            const state = aState({
                album: anAlbum({ films: [aFilm(), film] }),
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmStoreManager(state, bus, api);

            manager.sortImageList({ filmId: "wrong id", newOrder: [] });

            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
            expectRender(bus);
        });
    });

    describe("Edit Film Info", () => {
        const EDITED_FIELDS = {
            camera: "new camera",
            lens: "new lens",
            filmStock: "new film stock",
            shotISO: "800",
            filmStockExpiration: "new film stock expiration",
        };

        it("Should edit info, open info modal, reset form and create a notification on success", () => {
            const film = aFilm();
            const state = aState({
                album: anAlbum({ films: [film] }),
                forms: {
                    [EDIT_FILM_INFO_FORM]: aForm({
                        values: {
                            ...EDITED_FIELDS,
                            filmId: film.id,
                        },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmStoreManager(state, bus, api);

            manager.editFilmInfo();

            expect(state.album?.films[0].info).toStrictEqual(EDITED_FIELDS);
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                EDIT_FILM_INFO_SUCCESS,
            );
            expect(bus.emit).toHaveBeenCalledWith(OPEN_MODAL, {
                modalId: FILM_INFO_MODAL,
            });
            expectRender(bus);
        });

        it("Should add form error if info values dont pass validation", () => {
            const film = aFilm();
            const state = aState({
                album: anAlbum({ films: [film] }),
                forms: {
                    [EDIT_FILM_INFO_FORM]: aForm({
                        values: {
                            ...EDITED_FIELDS,
                            shotISO: "not a number",
                            filmId: film.id,
                        },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmStoreManager(state, bus, api);

            manager.editFilmInfo();

            expect(state.album?.films[0].info).toStrictEqual(film.info);
            expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
                formId: EDIT_FILM_INFO_FORM,
                error: INVALID_SHOT_ISO,
            });
            expectRender(bus);
        });

        it("Should close form and create a notification on unexpected error", () => {
            const film = aFilm();
            const state = aState({
                album: anAlbum({ films: [film] }),
                forms: {
                    [EDIT_FILM_INFO_FORM]: aForm({
                        values: {
                            ...EDITED_FIELDS,
                            filmId: "123",
                        },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmStoreManager(state, bus, api);

            manager.editFilmInfo();

            expect(state.album?.films[0].info).toStrictEqual(film.info);
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
            expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
            expectRender(bus);
        });
    });

    it("Should register handlers", () => {
        const emitter = mock<Nanobus>();

        filmStore(aState(), emitter);

        const events = [
            ADD_FILM_REQUEST,
            EDIT_FILM_NAME_REQUEST,
            SORT_IMAGE_LIST,
            EDIT_FILM_INFO_REQUEST,
        ];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});
