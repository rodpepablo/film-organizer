import { describe, it, expect } from "vitest";
import { albumStore } from "../../../src/domain/stores/album";
import { CLOSE_MODAL, CREATE_ALBUM_REQUEST } from "../../../src/infra/events";
import { expectRender, spiedBus } from "../../test-util/mocking";

describe("Album store", () => {
    it("Should create album from request", () => {
        const state = {
            album: null,
        };
        const bus = spiedBus();
        albumStore(state, bus);

        bus.emit(CREATE_ALBUM_REQUEST, { name: "ALBUM_NAME" });

        expectRender(bus);
        expect(state.album).toStrictEqual({ name: "ALBUM_NAME" });
        expect(bus.emit).toHaveBeenCalledWith(CLOSE_MODAL);
    });
});
