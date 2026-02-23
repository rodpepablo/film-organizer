import { describe, it, expect } from "vitest";
import { mock, mocked } from "vitest-mock-extended";
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
    CREATE_IMAGE_PREVIEW_REQUEST,
    CREATE_NOTIFICATION,
    EDIT_IMAGE_NAME_REQUEST,
    FORM_ERROR,
} from "../../../src/infra/events";
import {
    aFilm,
    aForm,
    anAlbum,
    anImage,
    aState,
} from "../../test-util/fixtures";
import {
    EDIT_IMAGE_NAME_FORM,
    IMAGE_NAME_EDIT_SUCCESS,
    UNEXPECTED_ERROR,
} from "../../../src/infra/constants";
import { Form } from "../../../src/domain/models/ui";
import { expectRender, mockedAPI, spiedBus } from "../../test-util/mocking";
import { INVALID_IMAGE_NAME } from "../../../src/infra/errors";
import { IPCErrors } from "../../../src/infra/ipc-service";
import DateWrapper, { IDateWrapper } from "../../../src/infra/date-wrapper";

describe("Film Image store", () => {
    describe("Edit film image name", () => {
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
            const date = mock<IDateWrapper>();
            const manager = aManagerWith(state, bus, api, date);

            date.now.mockReturnValue("new date");

            manager.editFilmName();

            expect(state.album?.films[0].images[0].name).toEqual("new name");
            expect(state.album?.films[0].images[0].lastUpdated).toEqual("new date");
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
            const manager = aManagerWith(state, bus, api);

            manager.editFilmName();

            expect(state.album?.films[0].images[0].name).toEqual("old name");
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
                formId: EDIT_IMAGE_NAME_FORM,
                error: INVALID_IMAGE_NAME,
            });
            expect(bus.emit).not.toHaveBeenCalledWith(CLOSE_MODAL);
            expect(bus.emit).not.toHaveBeenCalledWith(CLEAR_FORM, expect.anything());
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
            const manager = aManagerWith(state, bus, api);

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

    describe("Create Image Preview", () => {
        it("should update previewPath", async () => {
            const image = anImage({ previewPath: null });
            const film = aFilm({ images: [image, anImage()] });
            const album = anAlbum({ films: [film, aFilm()] });
            const state = aState({ album });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = aManagerWith(state, bus, api);

            const previewPath = "/preview/path.jpg";
            api.image.createPreviewImage.mockResolvedValue({
                ok: true,
                result: previewPath,
            });

            await manager.createImagePreview({ imageId: image.id });

            expect(state.album?.films[0].images[0].previewPath).toEqual(previewPath);
            expectRender(bus);
        });

        it("Should update loading before and after generating the preview", async () => {
            const image = anImage({ previewPath: null, loading: false });
            const film = aFilm({ images: [image] });
            const album = anAlbum({ films: [film] });
            const state = aState({ album });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = aManagerWith(state, bus, api);

            const previewPath = "/preview/path.jpg";
            api.image.createPreviewImage.mockImplementation((image) => {
                expect(image.loading).toBeTruthy();
                return Promise.resolve({ ok: true, result: previewPath });
            });

            await manager.createImagePreview({ imageId: image.id });

            expect(state.album?.films[0].images[0].loading).toBeFalsy();
        });

        it("Should manage error from ipc handler", async () => {
            const image = anImage({ previewPath: null });
            const film = aFilm({ images: [image, anImage()] });
            const album = anAlbum({ films: [film, aFilm()] });
            const state = aState({ album });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = aManagerWith(state, bus, api);

            api.image.createPreviewImage.mockResolvedValue({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
            });

            await manager.createImagePreview({ imageId: image.id });

            expect(state.album?.films[0].images[0].previewPath).toBeNull();
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
            expectRender(bus);
        });

        it("Should manage unexpected error", async () => {
            const state = aState({ album: null });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = aManagerWith(state, bus, api);

            await manager.createImagePreview({ imageId: "123" });

            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
            expectRender(bus);
        });
    });

    it("Should register hanlders", () => {
        const emitter = mock<Nanobus>();

        filmImageStore({} as State, emitter);

        const events = [EDIT_IMAGE_NAME_REQUEST, CREATE_IMAGE_PREVIEW_REQUEST];
        expect(emitter.on).toHaveBeenCalledTimes(events.length);
        for (let event of events) {
            expect(emitter.on).toHaveBeenCalledWith(event, expect.any(Function));
        }
    });
});

function aManagerWith(
    state: State,
    bus: Nanobus,
    api: Window["api"],
    date: IDateWrapper = new DateWrapper(),
) {
    return new FilmImageStoreManager(state, bus, api, date);
}
