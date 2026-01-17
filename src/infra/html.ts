import choohtml from "choo/html";
// @ts-expect-error
import dom from "nanohtml/dom";
import jsdom from "jsdom";

const html =
    process.env.NODE_ENV === "test"
        ? dom(new jsdom.JSDOM().window.document)
        : choohtml;

export { html };
