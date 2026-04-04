import "electron";
import { Collection } from "./domain/models/collection";
import { Film, FilmImage } from "./domain/models/film";
import { IPCResult } from "./infra/ipc-service";

declare global {
    interface Window {
        api: {
            fs: {
                getFolder(): Promise<string | null>;
                getFile(): Promise<string | null>;
            };
            collection: {
                createCollection(path: string, name: string): Promise<Collection>;
                loadCollection(path: string): Promise<IPCResult<Collection>>;
                saveCollection(collection: Collection): Promise<Collection>;
            };
            film: {
                addFilm(
                    collectionPath: string,
                    filmPath: string,
                ): Promise<IPCResult<Film>>;
            };
            image: {
                createPreviewImage(image: FilmImage): Promise<IPCResult<string>>;
            };
        };
    }
}
