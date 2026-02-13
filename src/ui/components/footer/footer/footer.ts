import "./footer.css";
import { State, Emit } from "../../../../domain/models/state";
import { html } from "../../../../infra/html";
import { albumNameSelector } from "../../../../infra/selectors/album";
import Button from "../../general/button/button";
import { saveAlbum } from "../../../../infra/actions/album";

export default function footer(state: State, emit: Emit): HTMLElement {
    const albumName = albumNameSelector(state);
    return html`
        <footer class="footer">
            ${albumName && footerAlbumInfo(state, emit, albumName)}
        </footer>
    `;
}

function footerAlbumInfo(
    state: State,
    emit: Emit,
    albumName: string,
): HTMLElement {
    const button = new Button({
        value: "save",
        type: "tiny",
        onclick: emitSave(emit),
    });
    return html`
        <div class="footer-album">
            ${button.render(state, emit)}
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
        saveAlbum(emit);
    };
}
