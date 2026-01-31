import { albumStore } from "./album";
import { filmStore } from "./film";
import { uiStore } from "./ui";

export function registerStores(app: any) {
    app.use(uiStore);
    app.use(albumStore);
    app.use(filmStore);
}
