import { Album } from "../../src/domain/models/album";

export const anAlbum = (attributes: object = {}): Album => {
    return {
        name: "TEST ALBUM",
        path: "/PATH/TO/ALBUM.json",
        films: [],
        ...attributes,
    } as Album;
};
