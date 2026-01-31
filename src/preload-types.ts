import "electron";
import { Album } from "./domain/models/album";
import { Film } from "./domain/models/film";
import { IPCResult } from "./infra/ipc-service";

declare global {
    interface Window {
        api: {
            fs: {
                getFolder(): Promise<string | null>;
                getFile(): Promise<string | null>;
            };
            album: {
                createAlbum(path: string, name: string): Promise<Album>;
                loadAlbum(path: string): Promise<Album>;
            };
            film: {
                addFilm(albumPath: string, filmPath: string): Promise<IPCResult<Film>>;
            };
        };
    }
}
