import { describe, it, expect } from "vitest";
import { albumStore } from "../../../src/domain/stores/album";
import { CREATE_ALBUM_FORM } from "../../../src/infra/constants";
import { INVALID_ALBUM_NAME } from "../../../src/infra/errors";
import {
    CLEAR_FORM,
    CLOSE_MODAL,
    CREATE_ALBUM_REQUEST,
    FORM_ERROR,
} from "../../../src/infra/events";
import { expectRender, spiedBus } from "../../test-util/mocking";

describe("Album store", () => {
    it("Should create album from request", () => {
        const state = {
            album: null,
        };
        const bus = spiedBus();
        albumStore(state, bus);

        bus.emit(CREATE_ALBUM_REQUEST, { name: "ALBUM_NAME" });

        expect(state.album).toStrictEqual({ name: "ALBUM_NAME" });
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            form: CREATE_ALBUM_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
        expectRender(bus);
    });

    it("Should add an error to the form when invalid", () => {
        const state = {
            album: null,
        };
        const bus = spiedBus();
        albumStore(state, bus);

        bus.emit(CREATE_ALBUM_REQUEST, { name: "" });

        expect(state.album).toBeNull();
        expect(bus.emit).toHaveBeenCalledWith(CLEAR_FORM, {
            form: CREATE_ALBUM_FORM,
        });
        expect(bus.emit).toHaveBeenCalledWith(FORM_ERROR, {
            form: CREATE_ALBUM_FORM,
            error: INVALID_ALBUM_NAME,
        });
    });
});
