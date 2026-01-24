import Nanobus from "nanobus";
import { expect, vi } from "vitest";

export function spiedBus() {
    const bus = new Nanobus();
    vi.spyOn(bus, "emit");
    return bus;
}

export function expectRender(bus: Nanobus) {
    expect(bus.emit).toHaveBeenCalledWith("render");
}

export function mockFormData(): any {
    return class {
        private data = new Map<string, string>();

        constructor(form?: HTMLFormElement) {
            if (form) {
                const inputs = Array.from(
                    form.querySelectorAll<HTMLInputElement>("input[name]"),
                );
                inputs.forEach((input: HTMLInputElement) => {
                    this.data.set(input.name, input.value);
                });
            }
        }

        get(key: string) {
            return this.data.get(key) ?? null;
        }
    } as any;
}
