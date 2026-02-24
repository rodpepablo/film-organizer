import { collectionStore } from "./collection";
import { filmStore } from "./film";
import { filmImageStore } from "./film-image";
import { uiStore } from "./ui";

export function registerStores(app: any) {
    app.use(uiStore);
    app.use(collectionStore);
    app.use(filmStore);
    app.use(filmImageStore);
}
