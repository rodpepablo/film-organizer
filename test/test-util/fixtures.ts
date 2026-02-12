import { v4 as uuidv4 } from "uuid";
import { Album } from "../../src/domain/models/album";
import { Film, FilmImage } from "../../src/domain/models/film";
import { Form } from "../../src/domain/models/ui";

export const anAlbum = (attributes: Partial<Album> = {}): Album => {
    return {
        name: "TEST ALBUM",
        path: "/PATH/TO/ALBUM.json",
        films: [],
        ...attributes,
    } as Album;
};

export const aFilm = (attributes: Partial<Film> = {}): Film => {
    return {
        id: uuidv4().toString(),
        name: "TEST FILM",
        path: "FILM/TIF",
        images: [],
        ...attributes,
    };
};

export const anImage = (attributes: Partial<FilmImage> = {}): FilmImage => {
    return {
        id: uuidv4().toString(),
        name: "TEST IMAGE",
        ext: "jpg",
        path: "/PATH/TO/IMAGE.jpg",
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
