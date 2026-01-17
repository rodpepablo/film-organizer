import { uiStore } from "./ui";

export function registerStores(app: any) {
    app.use(uiStore);
}
