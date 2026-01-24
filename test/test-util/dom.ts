import { jsdomWindow } from "../../src/infra/html";

const window = jsdomWindow();

export const setInputValueTo = (dom: HTMLElement, name: string, value: any) =>
    (dom.querySelector<HTMLInputElement>(`input[name=${name}]`)!.value = value);

export const submitForm = (dom: HTMLElement) => {
    const form =
        dom.tagName.toLowerCase() === "form" ? dom : dom.querySelector("form");
    form?.dispatchEvent(
        new window.Event("submit", {
            bubbles: true,
            cancelable: true,
        }),
    );
};
