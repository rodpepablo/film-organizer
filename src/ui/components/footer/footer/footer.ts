import "./footer.css";
import { State, Emit } from "../../../../domain/models/state";
import { html } from "../../../../infra/html";
import { collectionNameSelector } from "../../../../infra/selectors/collection";
import Button from "../../general/button/button";
import { saveCollection } from "../../../../infra/actions/collection";

export default function footer(state: State, emit: Emit): HTMLElement {
    const collectionName = collectionNameSelector(state);
    return html`
        <footer class="footer">
            ${collectionName && footerCollectionInfo(state, emit, collectionName)}
        </footer>
    `;
}

function footerCollectionInfo(
    state: State,
    emit: Emit,
    collectionName: string,
): HTMLElement {
    const button = new Button({
        value: "save",
        type: "tiny",
        onclick: emitSave(emit),
    });
    return html`
        <div class="footer-collection">
            ${button.render(state, emit)}
            <div class="footer-collection-info">
                <span class="footer-collection-span">Collection:</span>
                <h5 class="footer-collection-title">${collectionName}</h5>
            </div>
        </div>
    `;
}

function emitSave(emit: Emit) {
    return (e: DOMEvent) => {
        e.preventDefault();
        e.stopPropagation();
        saveCollection(emit);
    };
}
