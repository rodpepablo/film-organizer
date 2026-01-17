import "normalize.css";
import "./index.css";

import Choo from "choo";
import Nanobus from "nanobus";
import mainView from "./ui/views";
import { State } from "./domain/models/state";
import createInitialState from "./domain/stores/initial-state";
import { registerStores } from "./domain/stores";

const app = new Choo();
app.use((state: State, _: Nanobus) => {
    createInitialState(state);
});
registerStores(app);
app.route("/main_window/index.html", mainView);
app.mount("body");
