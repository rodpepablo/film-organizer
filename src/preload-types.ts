import "electron";
import { Album } from "./domain/models/album";

declare global {
    interface Window {
        api: {
            fs: {
                getFile(): Promise<string | null>;
            };
            album: {
                getFolder(): Promise<string | null>;
                saveAlbum(path: string, album: Album): Promise<void>;
                loadAlbum(path: string): Promise<Album>;
            };
        };
    }
}
