import "normalize.css";
import "./index.css";
import "./infra/webcomponents";

import Choo from "choo";
import Nanobus from "nanobus";
import mainView from "./ui/views";
import { State } from "./domain/models/state";
import createInitialState from "./domain/stores/initial-state";
import { registerStores } from "./domain/stores";

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
app.route("/main_window/index.html", mainView);
app.mount("body");
