import choohtml from "choo/html";
// @ts-expect-error
import dom from "nanohtml/dom";
import jsdom from "jsdom";

const jsdomWindow = (() => {
    let w: jsdom.DOMWindow;
    return (): jsdom.DOMWindow => {
        w = w || new jsdom.JSDOM().window;
        return w;
    };
})();

const html =
    process.env.NODE_ENV === "test" ? dom(jsdomWindow().document) : choohtml;

export { html, jsdomWindow };
