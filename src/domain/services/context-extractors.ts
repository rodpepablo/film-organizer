import { Collection } from "../models/collection";
import { FilmImage, FilmInfo } from "../models/film";
import { IContextExtractor } from "../ports/renamer";

const NOT_FILM_FOR_IMAGE = "No film found for given image";

export class ImageIndexExtractor implements IContextExtractor {
    templateElement = "ii";
    extract(collection: Collection, image: FilmImage): string {
        const film = collection.films.find((film) => film.id === image.filmId);
        if (film == null) throw new ContextPropExtractorError(NOT_FILM_FOR_IMAGE);

        for (let i in film.images) {
            if (film.images[i].id === image.id) return String(Number(i) + 1);
        }
    }
}

export class FilmIndexExtractor implements IContextExtractor {
    templateElement = "fi";
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
    private prop: keyof FilmInfo;

    constructor(templateElement: string, prop: keyof FilmInfo) {
        this.templateElement = templateElement;
        this.prop = prop;
    }

    extract(collection: Collection, image: FilmImage): string {
        const film = collection.films.find((film) => film.id === image.filmId);

        if (film == null) throw new ContextPropExtractorError(NOT_FILM_FOR_IMAGE);

        return film.info[this.prop];
    }
}

export class ContextPropExtractorError extends Error { }
