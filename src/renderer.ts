import "normalize.css";
import "./index.css";
import choo from "choo";
import mainView from "./ui/views";

const app = choo();
app.route("/main_window/index.html", mainView);
app.mount("body");
