import "./image.css";
import { FilmImage } from "../../../../domain/models/film";
import { State, Emit } from "../../../../domain/models/state";
import { createImagePreviewRequest } from "../../../../infra/actions/film-image";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";
import Icon from "../../general/icon/icon";
import config from "../../../../infra/config";

export default class ImageComponent implements Component {
    image: FilmImage;

    constructor(image: FilmImage) {
        this.image = image;
    }

    render(state: State, emit: Emit): HTMLElement {
        const path = this.checkPreviewPath(emit);
        const lastUpdated =
            this.image.lastUpdated != null ? `?v=${this.image.lastUpdated}` : "";
        if (path != null) {
            const safePath = `safe-file://${path}${lastUpdated}`;

            return html`<img class="image" src="${safePath}" />`;
        }

        return html`
            <div class="image-loading">
                ${new Icon({ icon: "mdi:loading" }).render(state, emit)}
            </div>
        `;
    }

    private checkPreviewPath(emit: Emit): string | null {
        if (this.requiresPreview(this.image.ext)) {
            if (this.image.previewPath != null) {
                return this.image.previewPath;
            } else {
                if (this.image.loading !== true)
                    createImagePreviewRequest(emit, { imageId: this.image.id });
                return null;
            }
        }
        return this.image.path;
    }

    private requiresPreview(ext: string): boolean {
        return config.images.requiresPreview.indexOf(ext.toLowerCase()) >= 0;
    }
}
