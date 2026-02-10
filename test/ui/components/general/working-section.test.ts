import { describe, it, expect } from "vitest";
import { State } from "../../../../src/domain/models/state";
import {
    FILM_DETAIL_SECTION,
    FILM_SECTION,
    HOME_SECTION,
} from "../../../../src/infra/constants";
import workingSection from "../../../../src/ui/components/general/working-section/working-section";
import { aFilm, anAlbum } from "../../../test-util/fixtures";

const BASE_STATE = {
    album: anAlbum({ films: [aFilm()] }),
};

const SECTIONS = [
    [HOME_SECTION, "#default-section"],
    [FILM_SECTION, "#film-section"],
    [FILM_DETAIL_SECTION, "#film-detail-section"],
];

describe("Working section", () => {
    it.each(SECTIONS)(
        "should show %s section when selected on location",
        (location, selector) => {
            const state = { ...BASE_STATE, location: [location] } as State;

            const dom = workingSection(state, () => { });

            expect(dom.querySelector(selector)).not.toBeNull();
        },
    );
});
