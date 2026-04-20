import "./input.css";
import { State, Emit } from "../../../../../../domain/models/state";
import { html, jsdomWindow } from "@html";
import { IInput, InputConfig } from "./input";
import { KEY_DOWN, KEY_ENTER, KEY_UP } from "../../../../../../infra/constants";

type OptionsInputValue = {
    id: string;
    value?: string;
};

type OptionsInputConfig = InputConfig & {
    options: OptionsInputValue[];
};

export default class OptionsInput implements IInput {
    private config: OptionsInputConfig;
    value?: OptionsInputValue | string;
    name: string;
    targetedOption: number;
    opened: boolean;

    constructor(config: OptionsInputConfig) {
        this.config = config;
        this.name = config.name;
        this.targetedOption = -1;
        this.opened = false;
    }

    setValue(value: OptionsInputValue | string): void {
        this.value = value;
    }

    private get inputValue(): string {
        if (typeof this.value === "string") return this.value;
        if (this.value == null) return "";
        if (this.value.value != null) return this.value.value;
        if (this.value.id != null && this.value.value == null) {
            return (
                this.config.options.find((option) => option.id === this.value!.id)!
                    .value || ""
            );
        }

        return "";
    }

    private get options(): OptionsInputValue[] {
        return this.config.options.filter((option) =>
            option.value?.toLowerCase().startsWith(this.inputValue.toLowerCase()),
        );
    }

    open(inputElement: HTMLElement) {
        inputElement
            .parentNode!.querySelector<HTMLElement>(".input-options")!
            .removeAttribute("hidden");
        this.opened = true;
    }

    close(inputElement: HTMLElement) {
        inputElement
            .parentNode!.querySelector<HTMLElement>(".input-options")!
            .setAttribute("hidden", "");
        this.opened = false;
    }

    private updateValue(input: HTMLInputElement, value: string) {
        input.value = value;
        const w = process.env.NODE_ENV === "test" ? jsdomWindow() : window;
        input.dispatchEvent(new w.Event("change", { bubbles: true }));
    }

    private scrollTo(options: HTMLElement[], index: number) {
        if (process.env.NODE_ENV !== "test") options[index].scrollIntoView();
    }

    private updateTargetedOption(input: HTMLInputElement) {
        const options = Array.from(
            input.parentNode!.querySelectorAll<HTMLElement>("li"),
        );
        options.forEach((option) => option.removeAttribute("targeted"));
        if (this.targetedOption >= 0) {
            options[this.targetedOption].setAttribute("targeted", "");
            this.scrollTo(options, this.targetedOption);
        } else if (options.length > 0) {
            this.scrollTo(options, 0);
        }
    }

    private updateOptions(input: HTMLInputElement) {
        const inputOptions = input.parentNode?.querySelector(".input-options")!;
        this.targetedOption = -1;
        inputOptions.innerHTML = "";
        for (let option of this.options) {
            inputOptions.appendChild(optionComponent(option));
        }
    }

    private onFocus() {
        return (e: DOMEvent) => {
            const input = e.target as HTMLInputElement;
            this.open(input);
            this.targetedOption = -1;
            this.updateTargetedOption(input);
        };
    }

    private onBlur() {
        return (e: DOMEvent) => {
            this.close(e.target as HTMLElement);
        };
    }

    private onInput() {
        return (e: DOMEvent) => {
            const input = e.target as HTMLInputElement;
            this.setValue(input.value);
            this.updateOptions(input);
            if (this.options.length > 0) {
                this.open(input);
            } else {
                this.close(input);
            }
        };
    }

    private onOptionClick() {
        return (e: DOMEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === "li") {
                const input =
                    target.parentNode?.parentNode?.querySelector<HTMLInputElement>(
                        "input",
                    )!;
                this.updateValue(input, target.getAttribute("option-value") || "");
                this.close(input);
            }
        };
    }

    private onKeydown() {
        return (e: KeyboardEvent) => {
            const input = e.target as HTMLInputElement;

            switch (e.keyCode) {
                case KEY_DOWN:
                    e.preventDefault();
                    this.targetedOption = (this.targetedOption + 1) % this.options.length;
                    this.updateTargetedOption(input);
                    break;
                case KEY_UP:
                    e.preventDefault();
                    this.targetedOption =
                        this.targetedOption - 1 >= 0
                            ? this.targetedOption - 1
                            : this.options.length - 1;
                    this.updateTargetedOption(input);
                    break;
                case KEY_ENTER:
                    if (
                        this.opened &&
                        this.targetedOption >= 0 &&
                        this.options.length > 0
                    ) {
                        e.preventDefault();
                        this.updateValue(
                            input,
                            this.options[this.targetedOption].value || "",
                        );
                        this.close(input);
                    }
                    break;
            }
        };
    }

    render(state: State, emit: Emit): HTMLElement {
        return html`
            <div class="input-container">
                <label class="input-label">${this.config.label}:</label>
                <div class="input-options-container">
                    <input
                        class="input"
                        type="text"
                        name="${this.name}"
                        value="${this.inputValue}"
                        oninput=${this.onInput()}
                        onfocus=${this.onFocus()}
                        onblur=${this.onBlur()}
                        onkeydown=${this.onKeydown()}
                    />
                    <ul class="input-options" onmousedown=${this.onOptionClick()} hidden>
                        ${this.options.map(optionComponent)}
                    </ul>
                </div>
            </div>
        `;
    }
}

function optionComponent(option: OptionsInputValue) {
    const value = option.value || "";
    return html`<li option-value="${value}">${value}</li>`;
}
