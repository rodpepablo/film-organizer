import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import "../../../src/preload-types";
import { AlbumStoreManager } from "../../../src/domain/stores/album";
import { CREATE_ALBUM_FORM } from "../../../src/infra/constants";
import { INVALID_ALBUM_NAME } from "../../../src/infra/errors";
import { CLEAR_FORM, CLOSE_MODAL, FORM_ERROR } from "../../../src/infra/events";
import { expectRender, spiedBus } from "../../test-util/mocking";

describe("Album store", () => {
    it("Should create album from request", async () => {
        const state = {
            album: null,
        };
        const bus = spiedBus();
        const api = {
            fs: mock<Window["api"]["fs"]>(),
            album: mock<Window["api"]["album"]>(),
        };
        const manager = new AlbumStoreManager(state, bus, api);

        api.fs.getFolder.mockResolvedValue("PATH");
        api.album.saveAlbum.mockResolvedValue();
        await manager.manageCreateAlbum({ name: "ALBUM_NAME" });

        const expectedAlbum = {
            name: "ALBUM_NAME",
        };
        expect(state.album).toStrictEqual(expectedAlbum);
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            form: CREATE_ALBUM_FORM,
        });
        expect(api.album.saveAlbum).toHaveBeenCalledWith("PATH", expectedAlbum);
        expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
        expectRender(bus);
    });

    it("Should add an error to the form when invalid", async () => {
        const state = {
            album: null,
        };
        const bus = spiedBus();
        const api = mock<Window["api"]>();
        const manager = new AlbumStoreManager(state, bus, api);

        await manager.manageCreateAlbum({ name: "" });

        expect(state.album).toBeNull();
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            form: CREATE_ALBUM_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
            form: CREATE_ALBUM_FORM,
            error: INVALID_ALBUM_NAME,
        });
    });

    it("Should load an album if selected", async () => {
        const state = { album: null };
        const bus = spiedBus();
        const api = {
            fs: mock<Window["api"]["fs"]>(),
            album: mock<Window["api"]["album"]>(),
        };
        const manager = new AlbumStoreManager(state, bus, api);
        const expectedAlbum = { name: "test-album" };

        api.fs.getFile.mockResolvedValue("/PATH/TO/FILE.json");
        api.album.loadAlbum.mockResolvedValue(expectedAlbum);

        await manager.manageLoadAlbum();

        expect(state.album).toStrictEqual(expectedAlbum);
        expect(api.fs.getFile).toHaveBeenCalledWith();
        expect(api.album.loadAlbum).toHaveBeenCalledWith("/PATH/TO/FILE.json");
        expectRender(bus);
    });

    it("Should not render or change album on file selection cancel", async () => {
        const currentAlbum = { name: "loaded-album" };
        const state = { album: currentAlbum };
        const bus = spiedBus();
        const api = {
            fs: mock<Window["api"]["fs"]>(),
            album: mock<Window["api"]["album"]>(),
        };
        const manager = new AlbumStoreManager(state, bus, api);

        api.fs.getFile.mockResolvedValue(null);

        await manager.manageLoadAlbum();

        expect(state.album).toStrictEqual(currentAlbum);
        expect(api.fs.getFile).toHaveBeenCalledWith();
        expect(api.album.loadAlbum).not.toHaveBeenCalled();
        expect(bus.emit).not.toHaveBeenCalledWith("render");
    });
});
