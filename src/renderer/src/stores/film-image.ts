import Nanobus from "nanobus";
import {
    BULK_EDIT_IMAGE_NAME_FORM,
    BULK_IMAGE_NAME_EDIT_SUCCESS,
    EDIT_IMAGE_NAME_FORM,
    IMAGE_NAME_EDIT_SUCCESS,
    UNEXPECTED_ERROR,
} from "../../../infra/constants";
import { IPCErrors } from "../../../infra/ipc-service";
import { IPCError } from "../../../infra/ipc-service";
import { uiFormValuesSelector } from "../selectors/ui";
import {
    BULK_EDIT_IMAGE_NAME_REQUEST,
    CREATE_IMAGE_PREVIEW_REQUEST,
    EDIT_IMAGE_NAME_REQUEST,
} from "../../../infra/events";
import { State, Emit } from "../../../domain/models/state";
import {
    clearFormError,
    createNotification,
    closeModal,
    clearForm,
    formError,
} from "../actions/ui";
import { ImageValidators } from "../../../domain/validators/film-image";
import { FilmImage } from "../../../domain/models/film";
import DateWrapper, { IDateWrapper } from "../../../infra/adapters/date-wrapper";
import {
    NonInjectiveTemplateError,
    UnregisteredPropExtractorError,
    ImageRenamerService,
} from "../../../domain/services/renamer";
import {
    NON_INJECTIVE_TEMPLATE,
    UNSUPPORTED_TEMPLATE_TAG,
} from "../../../infra/errors";
import {
    BulkEditImageNameValues,
    CreateImagePreviewParams,
    EditFilmNameValues,
} from "./types";
import { CannotFindImageError } from "../../../domain/models/errors";

export class FilmImageStoreManager {
    state: State;
    emit: Emit;
    api: Window["api"];
    date: IDateWrapper;

    constructor(
        state: State,
        emitter: Nanobus,
        api: Window["api"],
        date: DateWrapper,
    ) {
        this.state = state;
        this.emit = emitter.emit.bind(emitter);
        this.api = api;
        this.date = date;
    }

    editImageName = () => {
        clearFormError(this.emit, { formId: EDIT_IMAGE_NAME_FORM });
        const values: EditFilmNameValues = uiFormValuesSelector(
            this.state,
            EDIT_IMAGE_NAME_FORM,
        );

        try {
            const [isValid, error] = ImageValidators.imageNameEdit
                .withContext(this.state.collection!)
                .validate(values);
            if (!isValid) {
                formError(this.emit, {
                    formId: EDIT_IMAGE_NAME_FORM,
                    error: error.msg,
                });
                this.emit("render");
                return;
            }

            const film = this.state.collection!.films.find(
                (film) => film.id === values.filmId,
            )!;
            const image = film.images.find((image) => image.id === values.imageId)!;
            image.name = values.name;
            image.lastUpdated = this.date.now();

            createNotification(this.emit, IMAGE_NAME_EDIT_SUCCESS);
        } catch (error) {
            this.manageErrors({
                ok: false,
                type: IPCErrors.UNEXPECTED_ERROR,
                message: error as string,
            });
        }

        closeModal(this.emit);
        clearForm(this.emit, { formId: EDIT_IMAGE_NAME_FORM });
        this.emit("render");
    };

    bulkEditImageName = () => {
        try {
            clearFormError(this.emit, { formId: BULK_EDIT_IMAGE_NAME_FORM });
            const values = uiFormValuesSelector(
                this.state,
                BULK_EDIT_IMAGE_NAME_FORM,
            ) as BulkEditImageNameValues;

            const film = this.state.collection!.films.find(
                (film) => film.id === values.filmId,
            )!;
            const imageRenamer = new ImageRenamerService(this.state.collection!);
            film.images = imageRenamer.rename(
                film.images,
                values.nameTemplate,
            ) as FilmImage[];
            const newDate = this.date.now();
            film.images.forEach((image) => (image.lastUpdated = newDate));

            closeModal(this.emit);
            clearForm(this.emit, { formId: BULK_EDIT_IMAGE_NAME_FORM });
            createNotification(this.emit, BULK_IMAGE_NAME_EDIT_SUCCESS);
        } catch (error) {
            switch (error!.constructor) {
                case UnregisteredPropExtractorError:
                    formError(this.emit, {
                        formId: BULK_EDIT_IMAGE_NAME_FORM,
                        error: UNSUPPORTED_TEMPLATE_TAG,
                    });
                    break;
                case NonInjectiveTemplateError:
                    formError(this.emit, {
                        formId: BULK_EDIT_IMAGE_NAME_FORM,
                        error: NON_INJECTIVE_TEMPLATE,
                    });
                    break;
                default:
                    this.manageErrors({
                        ok: false,
                        type: IPCErrors.UNEXPECTED_ERROR,
                        message: error as string,
                    });
            }
        }
        this.emit("render");
    };

    createImagePreview = async (params: CreateImagePreviewParams) => {
        let image: FilmImage | null = null;
        try {
            const { filmIndex, imageIndex } = this.findImage(params.imageId);
            image = this.state.collection!.films[filmIndex].images[imageIndex];
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
                message: error as string,
            });
        }
        this.emit("render");
    };

    private findImage(imageId: string): {
        filmIndex: number;
        imageIndex: number;
    } {
        for (let i = 0; i < this.state.collection!.films.length; i++) {
            const film = this.state.collection!.films[i];
            const j = film.images.findIndex((image) => image.id === imageId);
            if (j >= 0) {
                return { filmIndex: i, imageIndex: j };
            }
        }
        throw new CannotFindImageError();
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
    const filmImageStoreManager = new FilmImageStoreManager(
        state,
        emitter,
        api,
        new DateWrapper(),
    );

    emitter.on(EDIT_IMAGE_NAME_REQUEST, filmImageStoreManager.editImageName);
    emitter.on(
        BULK_EDIT_IMAGE_NAME_REQUEST,
        filmImageStoreManager.bulkEditImageName,
    );
    emitter.on(
        CREATE_IMAGE_PREVIEW_REQUEST,
        filmImageStoreManager.createImagePreview,
    );
}
