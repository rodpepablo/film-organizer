import "normalize.css";
import "./index.css";
import "./ui/webcomponents/webcomponents";

import Choo from "choo";
import Nanobus from "nanobus";
import mainView from "./ui/views";
import { State } from "../../domain/models/state";
import createInitialState from "./stores/initial-state";
import { registerStores } from "./stores";
const app = new Choo();
if (process.env.NODE_ENV === "development") {
    app.use((state: State, emitter: Nanobus) => {
        // @ts-expect-error
        window.state = state;
        emitter.on("*", (event: string, data: any) => {
            console.log(event, data);
        });
    });
}
app.use((state: State, _: Nanobus) => {
    createInitialState(state);
});
registerStores(app);
app.route("", mainView);
app.mount("body");
