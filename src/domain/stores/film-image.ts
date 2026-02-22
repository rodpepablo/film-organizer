import Nanobus from "nanobus";
import {
    EDIT_IMAGE_NAME_FORM,
    IMAGE_NAME_EDIT_SUCCESS,
    UNEXPECTED_ERROR,
} from "../../infra/constants";
import { IPCErrors } from "../../infra/ipc-service";
import { IPCError } from "../../infra/ipc-service";
import { uiFormValuesSelector } from "../../infra/selectors/ui";
import {
    CREATE_IMAGE_PREVIEW_REQUEST,
    EDIT_IMAGE_NAME_REQUEST,
} from "../../infra/events";
import { State, Emit } from "../models/state";
import {
    clearFormError,
    createNotification,
    closeModal,
    clearForm,
    formError,
} from "../../infra/actions/ui";
import { ImageValidators } from "../validators/film-image";
import { FilmImage } from "../models/film";

export class FilmImageStoreManager {
    state: State;
    emit: Emit;
    api: Window["api"];

    constructor(state: State, emitter: Nanobus, api: Window["api"]) {
        this.state = state;
        this.emit = emitter.emit.bind(emitter);
        this.api = api;
    }

    editFilmName = () => {
        clearFormError(this.emit, { formId: EDIT_IMAGE_NAME_FORM });
        const values: EditFilmNameValues = uiFormValuesSelector(
            this.state,
            EDIT_IMAGE_NAME_FORM,
        );

        try {
            const [isValid, error] = ImageValidators.filmNameEdit
                .withContext(this.state.album)
                .validate(values);
            if (!isValid) {
                formError(this.emit, {
                    formId: EDIT_IMAGE_NAME_FORM,
                    error: error.msg,
                });
                this.emit("render");
                return;
            }

            const film = this.state.album.films.find(
                (film) => film.id === values.filmId,
            );
            const image = film.images.find((image) => image.id === values.imageId);
            image.name = values.name;

            createNotification(this.emit, IMAGE_NAME_EDIT_SUCCESS);
        } catch (error) {
            this.manageErrors({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
                message: error,
            });
        } finally {
            closeModal(this.emit);
            clearForm(this.emit, { formId: EDIT_IMAGE_NAME_FORM });
            this.emit("render");
        }
    };

    createImagePreview = async (params: CreateImagePreviewParams) => {
        let image: FilmImage = null;
        try {
            const { filmIndex, imageIndex } = this.findImage(params.imageId);
            image = this.state.album.films[filmIndex].images[imageIndex];
            image.loading = true;
            const previewPath = await this.api.image.createPreviewImage(image);
            image.loading = false;
            if (previewPath.ok) {
                image.previewPath = previewPath.result;
            } else {
                this.manageErrors(previewPath as IPCError);
            }
        } catch (error) {
            if (image != null) image.loading = false;
            this.manageErrors({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
                message: error,
            });
        }
        this.emit("render");
    };

    private findImage(imageId: string): {
        filmIndex: number;
        imageIndex: number;
    } {
        for (let i = 0; i < this.state.album.films.length; i++) {
            const film = this.state.album.films[i];
            const j = film.images.findIndex((image) => image.id === imageId);
            if (j >= 0) {
                return { filmIndex: i, imageIndex: j };
            }
        }
    }

    private manageErrors(error: IPCError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        if (error.type === IPCErrors.UNEXPECTED_ERROR)
            createNotification(this.emit, UNEXPECTED_ERROR);
    }
}

export function filmImageStore(state: State, emitter: Nanobus) {
    const api =
        process.env.NODE_ENV !== "test" ? window.api : ({} as Window["api"]);
    const filmImageStoreManager = new FilmImageStoreManager(state, emitter, api);

    emitter.on(EDIT_IMAGE_NAME_REQUEST, filmImageStoreManager.editFilmName);
    emitter.on(
        CREATE_IMAGE_PREVIEW_REQUEST,
        filmImageStoreManager.createImagePreview,
    );
}

export type EditFilmNameValues = {
    filmId: string;
    imageId: string;
    name: string;
};

export type CreateImagePreviewParams = {
    imageId: string;
};
