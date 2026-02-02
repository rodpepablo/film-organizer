import "./footer.css";
import { State, Emit } from "../../../../domain/models/state";
import { html } from "../../../../infra/html";
import { albumNameSelector } from "../../../../infra/selectors/album";
import button from "../../general/button/button";
import { SAVE_ALBUM_REQUEST } from "../../../../infra/events";

export default function footer(
    state: Pick<State, "album">,
    emit: Emit,
): HTMLElement {
    const albumName = albumNameSelector(state);
    return html`
        <footer class="footer">
            ${albumName && footerAlbumInfo(albumName, emit)}
        </footer>
    `;
}

function footerAlbumInfo(albumName: string, emit: Emit): HTMLElement {
    return html`
        <div class="footer-album">
            ${button({ value: "save", type: "tiny", onclick: emitSave(emit) })}
            <div class="footer-album-info">
                <span class="footer-album-span">Album:</span>
                <h5 class="footer-album-title">${albumName}</h5>
            </div>
        </div>
    `;
}

function emitSave(emit: Emit) {
    return (e: DOMEvent) => {
        e.preventDefault();
        e.stopPropagation();
        emit(SAVE_ALBUM_REQUEST);
    };
}
