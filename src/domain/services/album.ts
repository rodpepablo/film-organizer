import fs from "fs/promises";
import electron from "electron";
import { join, dirname } from "path";
import { IAlbumService } from "../ports/album";
import { IIPCService } from "../../infra/ipc-service";
import { Album } from "../models/album";
import {
    LOAD_ALBUM_HANDLER,
    CREATE_ALBUM_HANDLER,
    SAVE_ALBUM_HANDLER,
} from "../../infra/ipc-events";
import { Film, FilmImage } from "../models/film";

type Event = Electron.IpcMainInvokeEvent;

export default class AlbumService implements IAlbumService, IIPCService {
    load(ipcMain: Electron.IpcMain): void {
        ipcMain.handle(CREATE_ALBUM_HANDLER, this.createAlbum);
        ipcMain.handle(LOAD_ALBUM_HANDLER, this.loadAlbum);
        ipcMain.handle(SAVE_ALBUM_HANDLER, this.saveAlbum);
    }

    createAlbum = async (
        _: Event,
        path: string,
        name: string,
    ): Promise<Album> => {
        const album = {
            name,
            path: join(path, `${name}.json`),
            films: [],
        } as Album;

        await fs.writeFile(album.path, JSON.stringify(album));

        return album;
    };

    loadAlbum = async (_: Event, path: string): Promise<Album> => {
        const content = await fs.readFile(path, { encoding: "utf-8" });
        const album: Album = JSON.parse(content);

        return { ...album, path };
    };

    saveAlbum = async (_: Event, album: Album): Promise<Album> => {
        const savedAlbum = {
            ...album,
            films: album.films.map(this.parseFilm),
        };

        await fs.writeFile(album.path, JSON.stringify(savedAlbum), {
            encoding: "utf-8",
        });

        await Promise.all(album.films.map(this.postProcessFilm));

        return savedAlbum;
    };

    private async postProcessFilm(film: Film): Promise<void[]> {
        // Rename images to their id before renaming to the saved name
        // to avoid problems when swaping names between images.
        await Promise.all(
            film.images.map((image) =>
                fs.rename(
                    image.path,
                    join(dirname(image.path), `${image.id}.${image.ext}`),
                ),
            ),
        );

        return Promise.all(
            film.images.map((image) =>
                fs.rename(
                    join(dirname(image.path), `${image.id}.${image.ext}`),
                    join(dirname(image.path), `${image.name}.${image.ext}`),
                ),
            ),
        );
    }

    private parseFilm = (film: Film): Film => {
        return {
            ...film,
            images: film.images.map(this.parseImage),
        };
    };

    private parseImage = (image: FilmImage): FilmImage => {
        const imageDirname = dirname(image.path);
        return {
            ...image,
            path: join(imageDirname, `${image.name}.${image.ext}`),
            previewPath: null,
        };
    };
}
