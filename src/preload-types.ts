import "electron";
import { Album } from "./domain/models/album";

declare global {
    interface Window {
        api: {
            fs: {
                getFolder(): Promise<string | null>;
                getFile(): Promise<string | null>;
            };
            album: {
                saveAlbum(path: string, name: string): Promise<Album>;
                loadAlbum(path: string): Promise<Album>;
            };
        };
    }
}
