export interface IAlbumService {
    getFolder(): Promise<string | null>;
}
