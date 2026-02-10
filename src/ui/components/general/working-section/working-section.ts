import { html } from "../../../../infra/html";
import "./working-section.css";
import { State, Emit } from "../../../../domain/models/state";
import filmSection from "../../film/film-section/film-section";
import { baseLocationSelector } from "../../../../infra/selectors/ui";
import defaultSection from "../default-section/default-section";
import { FILM_DETAIL_SECTION, FILM_SECTION } from "../../../../infra/constants";
import filmDetailSection from "../../film/film-detail-section/film-detail-section";

export default (state: State, emit: Emit): HTMLElement => {
    const baseLocation = baseLocationSelector(state);
    const section = getSectionFrom(baseLocation);
    return html`
        <section id="working-section">
            ${section(state, emit)}
        </section>
    `;
};

function getSectionFrom(baseLocation: string) {
    switch (baseLocation) {
        case FILM_SECTION:
            return filmSection;
        case FILM_DETAIL_SECTION:
            return filmDetailSection;
        default:
            return defaultSection;
    }
}
