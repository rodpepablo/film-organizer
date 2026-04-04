import { v4 as uuidv4 } from "uuid";
import packageJSON from "../../package.json";
import { Collection } from "../../src/domain/models/collection";
import { Film, FilmImage, FilmInfo } from "../../src/domain/models/film";
import { State } from "../../src/domain/models/state";
import { Form } from "../../src/domain/models/ui";

export const aState = (attributes: Partial<State> = {}): State => {
    return {
        // From choo
        params: {},
        href: "",
        title: "",
        route: "",
        events: {},
        // custom
        notifications: [],
        location: ["home"],
        menus: {},
        modal: { active: false, modalId: null },
        forms: {},
        selectedFilm: null,
        collection: aCollection(),
        ...attributes,
    };
};

export const aCollection = (
    attributes: Partial<Collection> = {},
): Collection => {
    return {
        app: "FILM_ORGANIZER",
        version: packageJSON.version,
        name: "TEST COLLECTION",
        path: "/PATH/TO/COLLECTION.json",
        films: [],
        ...attributes,
    } as Collection;
};

export const aFilm = (attributes: Partial<Film> = {}): Film => {
    return {
        id: uuidv4().toString(),
        name: "TEST FILM",
        path: "FILM/TIF",
        bulkNameEditTemplate: "film-%fi-%ii",
        info: aFilmInfo(),
        images: [],
        ...attributes,
    };
};

export const aFilmInfo = (attributes: Partial<FilmInfo> = {}): FilmInfo => {
    return {
        camera: "Canon EOS",
        lens: "50mm f2.8",
        filmStock: "Kodak Gold 200",
        shotISO: "400",
        filmStockExpiration: "expired 2 years",
        ...attributes,
    };
};

export const anImage = (attributes: Partial<FilmImage> = {}): FilmImage => {
    return {
        id: uuidv4().toString(),
        filmId: uuidv4().toString(),
        name: "TEST IMAGE",
        ext: "jpg",
        path: "/PATH/TO/IMAGE.jpg",
        previewPath: null,
        loading: false,
        ...attributes,
    };
};

export const aForm = (attributes: Partial<Form> = {}): Form => {
    return {
        error: null,
        values: {},
        ...attributes,
    };
};
