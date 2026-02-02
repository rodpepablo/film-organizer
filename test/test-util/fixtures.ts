import { v4 as uuidv4 } from "uuid";
import { Album } from "../../src/domain/models/album";
import { Film } from "../../src/domain/models/film";

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
        id: uuidv4.toString(),
        name: "TEST FILM",
        path: "FILM/TIF",
        images: [],
        ...attributes,
    };
};
