import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import Nanobus from "nanobus";
import { State } from "../../../src/domain/models/state";
import {
    filmImageStore,
    FilmImageStoreManager,
} from "../../../src/domain/stores/film-image";
import {
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    EDIT_IMAGE_NAME_REQUEST,
    FORM_ERROR,
} from "../../../src/infra/events";
import { aFilm, aForm, anAlbum, anImage } from "../../test-util/fixtures";
import {
    EDIT_IMAGE_NAME_FORM,
    IMAGE_NAME_EDIT_SUCCESS,
    UNEXPECTED_ERROR,
} from "../../../src/infra/constants";
import { Form } from "../../../src/domain/models/ui";
import { expectRender, mockedAPI, spiedBus } from "../../test-util/mocking";
import { INVALID_IMAGE_NAME } from "../../../src/infra/errors";

describe("Film Image store", () => {
    describe("Edit film Image", () => {
        it("Should update film name and create a success notification", () => {
            const image = anImage({ name: "old name" });
            const film = aFilm({ images: [image, anImage()] });
            const state = {
                album: anAlbum({ films: [film] }),
                forms: {
                    [EDIT_IMAGE_NAME_FORM]: aForm({
                        values: {
                            imageId: image.id,
                            filmId: film.id,
                            name: "new name",
                        },
                    }),
                } as Record<string, Form>,
            } as State;
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmImageStoreManager(state, bus, api);

            manager.editFilmName();

            expect(state.album?.films[0].images[0].name).toEqual("new name");
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                IMAGE_NAME_EDIT_SUCCESS,
            );
            expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
                formId: EDIT_IMAGE_NAME_FORM,
            });
            expectRender(bus);
        });

        it("Should update form error if it doesnt pass validation", () => {
            const image = anImage({ name: "old name" });
            const film = aFilm({ images: [image, anImage()] });
            const state = {
                album: anAlbum({ films: [film] }),
                forms: {
                    [EDIT_IMAGE_NAME_FORM]: aForm({
                        values: {
                            imageId: image.id,
                            filmId: film.id,
                            name: "",
                        },
                    }),
                } as Record<string, Form>,
            } as State;
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmImageStoreManager(state, bus, api);

            manager.editFilmName();

            expect(state.album?.films[0].images[0].name).toEqual("old name");
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
                formId: EDIT_IMAGE_NAME_FORM,
                error: INVALID_IMAGE_NAME,
            });
            expectRender(bus);
        });

        it("Should clear and close and create a notification on unexpected error", () => {
            // I.E. Album with no films will break the store
            const state = {
                album: anAlbum(),
                forms: {
                    [EDIT_IMAGE_NAME_FORM]: aForm({
                        values: {
                            imageId: "123",
                            filmId: "234",
                            name: "new name",
                        },
                    }),
                } as Record<string, Form>,
            } as State;
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = new FilmImageStoreManager(state, bus, api);

            manager.editFilmName();

            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
            expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
                formId: EDIT_IMAGE_NAME_FORM,
            });
            expectRender(bus);
        });
    });

    it("Should register hanlders", () => {
        const emitter = mock<Nanobus>();

        filmImageStore({} as State, emitter);

        const events = [EDIT_IMAGE_NAME_REQUEST];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});
