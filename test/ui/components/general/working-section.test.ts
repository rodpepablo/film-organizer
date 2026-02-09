import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { FILM_SECTION } from "../../../../src/infra/constants";
import workingSection from "../../../../src/ui/components/general/working-section/working-section";
import { anAlbum } from "../../../test-util/fixtures";

const BASE_STATE = {
    album: anAlbum(),
};

describe("Working section", () => {
    it("should show default location", () => {
        const state = { location: ["home"] } as State;

        const dom = workingSection(state, () => { });

        expect(dom.querySelector("#default-section")).not.toBeNull();
    });

    it("should show films section when base location is film-list", () => {
        const state = { ...BASE_STATE, location: [FILM_SECTION] } as State;

        const dom = workingSection(state, () => { });

        expect(dom.querySelector("#film-section")).not.toBeNull();
    });
});
