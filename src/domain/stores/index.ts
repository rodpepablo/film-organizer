import { albumStore } from "./album";
import { uiStore } from "./ui";

export function registerStores(app: any) {
    app.use(uiStore);
    app.use(albumStore);
}
