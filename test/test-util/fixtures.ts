import { v4 as uuidv4 } from "uuid";
import { Album } from "../../src/domain/models/album";
import { Film, FilmImage } from "../../src/domain/models/film";

export const anAlbum = (attributes: object = {}): Album => {
    return {
        name: "TEST ALBUM",
        path: "/PATH/TO/ALBUM.json",
        films: [],
        ...attributes,
    } as Album;
};

export const aFilm = (attributes: object = {}): Film => {
    return {
        id: uuidv4().toString(),
        name: "TEST FILM",
        path: "FILM/TIF",
        images: [],
        ...attributes,
    };
};

export const anImage = (attributes: object = {}): FilmImage => {
    return {
        id: uuidv4().toString(),
        name: "TEST IMAGE",
        ext: "jpg",
        path: "/PATH/TO/IMAGE.jpg",
        ...attributes,
    };
};
