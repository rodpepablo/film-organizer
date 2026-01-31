export interface FilmImage {
    name: string;
    ext: string;
    path: string;
}

export interface Film {
    name: string;
    path: string;
    images: FilmImage[];
}
