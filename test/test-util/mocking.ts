import Nanobus from "nanobus";
import { expect, vi, ExpectStatic } from "vitest";

export function spiedBus() {
    const bus = new Nanobus();
    vi.spyOn(bus, "emit");
    return bus;
}

export function expectRender(bus: Nanobus) {
    expect(bus.emit).toHaveBeenCalledWith("render");
}

export function autoTimeout(expect: ExpectStatic, expectedDelay: number) {
    return (fn: Function, time: number) => {
        fn();
        expect(time).toEqual(expectedDelay);
    };
}
