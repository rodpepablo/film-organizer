export interface Film {
    id: string;
    name: string;
    path: string;
    info: FilmInfo;
    images: FilmImage[];
}

export interface FilmInfo {
    camera: string;
    lens: string;
    filmStock: string;
    shotISO: string;
    filmStockExpiration: string;
}

export interface FilmImage {
    id: string;
    name: string;
    ext: string;
    path: string;
    previewPath?: string | null;
    loading?: boolean;
    lastUpdated?: string;
}
