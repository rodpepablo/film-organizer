import { NamedEntity } from "./base";

export interface Film extends NamedEntity {
    path: string;
    bulkNameEditTemplate?: string;
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

export interface FilmImage extends NamedEntity {
    filmId: string;
    ext: string;
    path: string;
    previewPath?: string | null;
    loading?: boolean;
    lastUpdated?: string;
}
