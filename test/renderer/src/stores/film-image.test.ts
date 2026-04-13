import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import Nanobus from "nanobus";
import { State } from "../../../../src/domain/models/state";
import {
    filmImageStore,
    FilmImageStoreManager,
} from "../../../../src/renderer/src/stores/film-image";
import {
    BULK_EDIT_IMAGE_NAME_REQUEST,
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_IMAGE_PREVIEW_REQUEST,
    CREATE_NOTIFICATION,
    EDIT_IMAGE_NAME_REQUEST,
    FORM_ERROR,
} from "../../../../src/infra/events";
import {
    aFilm,
    aForm,
    aCollection,
    anImage,
    aState,
} from "../../../test-util/fixtures";
import {
    BULK_EDIT_IMAGE_NAME_FORM,
    BULK_IMAGE_NAME_EDIT_SUCCESS,
    EDIT_IMAGE_NAME_FORM,
    IMAGE_NAME_EDIT_SUCCESS,
    UNEXPECTED_ERROR,
} from "../../../../src/infra/constants";
import { Form } from "../../../../src/domain/models/ui";
import { expectRender, mockedAPI, spiedBus } from "../../../test-util/mocking";
import {
    INVALID_IMAGE_NAME,
    NON_INJECTIVE_TEMPLATE,
    UNSUPPORTED_TEMPLATE_TAG,
} from "../../../../src/infra/errors";
import { IPCErrors } from "../../../../src/infra/ipc-service";
import DateWrapper, { IDateWrapper } from "../../../../src/infra/adapters/date-wrapper";

describe("Film Image store", () => {
    describe("Edit film image name", () => {
        it("Should update film name and create a success notification", () => {
            const image = anImage({ name: "old name" });
            const film = aFilm({ images: [image, anImage()] });
            const state = {
                collection: aCollection({ films: [film] }),
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

            manager.editImageName();

            expect(state.collection?.films[0].images[0].name).toEqual("new name");
            expect(state.collection?.films[0].images[0].lastUpdated).toEqual(
                "new date",
            );
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
                collection: aCollection({ films: [film] }),
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

            manager.editImageName();

            expect(state.collection?.films[0].images[0].name).toEqual("old name");
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
            // I.E. Collection with no films will break the store
            const state = {
                collection: aCollection(),
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

            manager.editImageName();

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

    describe("Bulk edit film image names", () => {
        it("Should update names and create a success notification", () => {
            const film = aFilm();
            const anotherFilm = aFilm();
            const image1 = anImage({ filmId: film.id, name: "image1" });
            const image2 = anImage({ filmId: film.id, name: "image2" });
            film.images = [image1, image2];
            const state = aState({
                collection: aCollection({ films: [anotherFilm, film] }),
                forms: {
                    [BULK_EDIT_IMAGE_NAME_FORM]: aForm({
                        values: { filmId: film.id, nameTemplate: "%fi-%ii" },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const date = mock<IDateWrapper>();

            const manager = new FilmImageStoreManager(state, bus, api, date);

            date.now.mockReturnValue("new date");

            manager.bulkEditImageName();

            expect(film.images[0].name).toEqual("2-1");
            expect(film.images[1].name).toEqual("2-2");
            expect(film.images[0].lastUpdated).toEqual("new date");
            expect(film.images[1].lastUpdated).toEqual("new date");
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: BULK_EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
                formId: BULK_EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                BULK_IMAGE_NAME_EDIT_SUCCESS,
            );
        });

        it("Should put error on form when using unsupported template tag", () => {
            const film = aFilm();
            const image = anImage({ filmId: film.id, name: "not-changed" });
            film.images = [image];
            const state = aState({
                collection: aCollection({ films: [film] }),
                forms: {
                    [BULK_EDIT_IMAGE_NAME_FORM]: aForm({
                        values: { filmId: film.id, nameTemplate: "%aa" },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const date = mock<IDateWrapper>();

            const manager = new FilmImageStoreManager(state, bus, api, date);

            manager.bulkEditImageName();

            expect(film.images[0].name).toEqual("not-changed");
            expect(film.images[0].lastUpdated).toBeUndefined();
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: BULK_EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
                formId: BULK_EDIT_IMAGE_NAME_FORM,
                error: UNSUPPORTED_TEMPLATE_TAG,
            });
            expectRender(bus);
        });

        it("Should show error on form if template yields repeated names after rename", () => {
            const film = aFilm();
            const image1 = anImage({ filmId: film.id, name: "image1" });
            const image2 = anImage({ filmId: film.id, name: "image2" });
            film.images = [image1, image2];
            const state = aState({
                collection: aCollection({ films: [film] }),
                forms: {
                    [BULK_EDIT_IMAGE_NAME_FORM]: aForm({
                        values: { filmId: film.id, nameTemplate: "%fi" },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const date = mock<IDateWrapper>();

            const manager = new FilmImageStoreManager(state, bus, api, date);

            manager.bulkEditImageName();

            expect(film.images[0].name).toEqual("image1");
            expect(film.images[1].name).toEqual("image2");
            expect(film.images[0].lastUpdated).toBeUndefined();
            expect(film.images[1].lastUpdated).toBeUndefined();
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: BULK_EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
                formId: BULK_EDIT_IMAGE_NAME_FORM,
                error: NON_INJECTIVE_TEMPLATE,
            });
            expectRender(bus);
        });

        it("Should manage unexpected error", () => {
            const image = anImage();
            const film = aFilm({ images: [image] });
            const state = aState({
                collection: aCollection({ films: [film] }),
                forms: {
                    [BULK_EDIT_IMAGE_NAME_FORM]: aForm({
                        values: { filmId: "wrong-id", nameTemplate: "%fi-%ii" },
                    }),
                },
            });
            const bus = spiedBus();
            const api = mockedAPI();
            const date = mock<IDateWrapper>();

            const manager = new FilmImageStoreManager(state, bus, api, date);

            manager.bulkEditImageName();

            expect(film.images[0].name).toEqual(image.name);
            expect(film.images[0].lastUpdated).toEqual(image.lastUpdated);
            expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM_ERROR, {
                formId: BULK_EDIT_IMAGE_NAME_FORM,
            });
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
        });
    });

    describe("Create Image Preview", () => {
        it("should update previewPath", async () => {
            const image = anImage({ previewPath: null });
            const film = aFilm({ images: [image, anImage()] });
            const collection = aCollection({ films: [film, aFilm()] });
            const state = aState({ collection });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = aManagerWith(state, bus, api);

            const previewPath = "/preview/path.jpg";
            api.image.createPreviewImage.mockResolvedValue({
                ok: true,
                result: previewPath,
            });

            await manager.createImagePreview({ imageId: image.id });

            expect(state.collection?.films[0].images[0].previewPath).toEqual(
                previewPath,
            );
            expectRender(bus);
        });

        it("Should update loading before and after generating the preview", async () => {
            const image = anImage({ previewPath: null, loading: false });
            const film = aFilm({ images: [image] });
            const collection = aCollection({ films: [film] });
            const state = aState({ collection });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = aManagerWith(state, bus, api);

            const previewPath = "/preview/path.jpg";
            api.image.createPreviewImage.mockImplementation((image) => {
                expect(image.loading).toBeTruthy();
                return Promise.resolve({ ok: true, result: previewPath });
            });

            await manager.createImagePreview({ imageId: image.id });

            expect(state.collection?.films[0].images[0].loading).toBeFalsy();
        });

        it("Should manage error from ipc handler", async () => {
            const image = anImage({ previewPath: null });
            const film = aFilm({ images: [image, anImage()] });
            const collection = aCollection({ films: [film, aFilm()] });
            const state = aState({ collection });
            const bus = spiedBus();
            const api = mockedAPI();
            const manager = aManagerWith(state, bus, api);

            api.image.createPreviewImage.mockResolvedValue({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
            });

            await manager.createImagePreview({ imageId: image.id });

            expect(state.collection?.films[0].images[0].previewPath).toBeNull();
            expect(bus.emit).toHaveBeenCalledWith(
                CREATE_NOTIFICATION,
                UNEXPECTED_ERROR,
            );
            expectRender(bus);
        });

        it("Should manage unexpected error", async () => {
            const state = aState({ collection: null });
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

        const events = [
            EDIT_IMAGE_NAME_REQUEST,
            CREATE_IMAGE_PREVIEW_REQUEST,
            BULK_EDIT_IMAGE_NAME_REQUEST,
        ];
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
