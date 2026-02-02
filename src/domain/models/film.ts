export interface FilmImage {
    id: string;
    name: string;
    ext: string;
    path: string;
}

export interface Film {
    id: string;
    name: string;
    path: string;
    images: FilmImage[];
}
