import { FilmInfo } from "../../../domain/models/film";
import { EventParams } from "../../../domain/models/state";
import { Notification } from "../../../domain/models/ui";

export type NavigateParams = EventParams & {
    to: string[];
};

export type ToggleNavMenuParams = EventParams & {
    menu: string;
};

export type OpenModalParams = EventParams & {
    modalId: string;
};

export type FormEventParams = EventParams & {
    formId: string;
};

export type FormErrorParams = FormEventParams & {
    error: string;
};

export type FormUpdateParams = FormEventParams & {
    values: Record<string, any>;
};

export type DeleteNotificationParams = EventParams & Pick<Notification, "id">;
export type CreateNotificationParams = EventParams &
    Pick<Notification, "type" | "message">;

export type ShowFilmInfoParams = {
    filmId: string;
};

export type CreateCollectionValues = {
    name: string;
};

export type SortFilmListParams = {
    newOrder: string[];
};

export type EditFilmNameValues = {
    filmId: string;
    imageId: string;
    name: string;
};

export type BulkEditImageNameValues = {
    filmId: string;
    nameTemplate: string;
};

export type CreateImagePreviewParams = {
    imageId: string;
};

export type EditFilmNameParams = {
    filmId: string;
    name: string;
};

export type SortImageListParams = {
    filmId: string;
    newOrder: string[];
};

export type EditFilmInfoValues = FilmInfo & {
    filmId: string;
};
