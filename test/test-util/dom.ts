import { jsdomWindow } from "../../src/infra/html";

const window = jsdomWindow();

export const setInputValueTo = (dom: HTMLElement, name: string, value: any) => {
    const input = dom.querySelector<HTMLInputElement>(`input[name=${name}]`);
    input!.value = value;
    input!.dispatchEvent(new window.Event("change", { bubbles: true }));
};

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
