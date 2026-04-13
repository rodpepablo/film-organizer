import { Collection } from "../models/collection";
import { FilmImage, FilmInfo } from "../models/film";
import { IContextExtractor } from "../ports/renamer";

const NOT_FILM_FOR_IMAGE = "No film found for given image";

export class ImageIndexExtractor implements IContextExtractor {
    templateElement = "ii";
    helpText = "Image index";
    extract(collection: Collection, image: FilmImage): string {
        const film = collection.films.find((film) => film.id === image.filmId);
        if (film == null) throw new ContextPropExtractorError(NOT_FILM_FOR_IMAGE);

        for (let i in film.images) {
            if (film.images[i].id === image.id) return String(Number(i) + 1);
        }

        return "";
    }
}

export class FilmIndexExtractor implements IContextExtractor {
    templateElement = "fi";
    helpText = "Film index";
    extract(collection: Collection, image: FilmImage): string {
        const filmIndex = collection.films.findIndex(
            (film) => film.id === image.filmId,
        );

        if (filmIndex < 0) throw new ContextPropExtractorError(NOT_FILM_FOR_IMAGE);

        return String(filmIndex + 1);
    }
}

export class FilmInfoExtractor implements IContextExtractor {
    templateElement: string;
    helpText: string;
    private prop: keyof FilmInfo;

    constructor(templateElement: string, prop: keyof FilmInfo, helpText: string) {
        this.templateElement = templateElement;
        this.prop = prop;
        this.helpText = helpText;
    }

    extract(collection: Collection, image: FilmImage): string {
        const film = collection.films.find((film) => film.id === image.filmId);

        if (film == null) throw new ContextPropExtractorError(NOT_FILM_FOR_IMAGE);

        return film.info[this.prop];
    }
}

export const imageIndexExtractor = new ImageIndexExtractor();
export const filmIndexExtractor = new FilmIndexExtractor();
export const cameraExtractor = new FilmInfoExtractor("c", "camera", "Camera");
export const filmStockExtractor = new FilmInfoExtractor(
    "fs",
    "filmStock",
    "Film Stock",
);
export const lensExtractor = new FilmInfoExtractor("l", "lens", "Lens");
export const shotISOExtractor = new FilmInfoExtractor(
    "iso",
    "shotISO",
    "Shot ISO",
);
export const filmExpirationExtractor = new FilmInfoExtractor(
    "fe",
    "filmStockExpiration",
    "Film Stock Expiration",
);

export class ContextPropExtractorError extends Error { }
