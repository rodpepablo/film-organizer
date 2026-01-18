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
