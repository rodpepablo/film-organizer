export interface FilmImage {
    id: string;
    name: string;
    ext: string;
    path: string;
}

export interface FilmInfo {
    camera: string;
    lens: string;
    filmStock: string;
    shotISO: string;
    filmStockExpiration: string;
}

export interface Film {
    id: string;
    name: string;
    path: string;
    info: FilmInfo;
    images: FilmImage[];
}
