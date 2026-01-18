import "./footer.css";
import { Emit } from "../../../../domain/models/state";
import { State } from "../../../../domain/models/state";
import { html } from "../../../../infra/html";
import { albumNameSelector } from "../../../../infra/selectors/album";

export default function footer(
    state: Pick<State, "album">,
    emit: Emit,
): HTMLElement {
    const albumName = albumNameSelector(state);
    return html`
        <footer class="footer">
            ${albumName && footerAlbumInfo(albumName)}
        </footer>
    `;
}

function footerAlbumInfo(albumName: string): HTMLElement {
    return html`
        <div class="footer-album">
            <span class="footer-album-span">Album:</span>
            <h5 class="footer-album-title">${albumName}</h5>
        </div>
    `;
}
