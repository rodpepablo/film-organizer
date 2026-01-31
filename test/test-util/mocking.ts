import Nanobus from "nanobus";
import { expect, vi, ExpectStatic } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";

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

type MockedAPI = {
    fs: MockProxy<Window["api"]["fs"]>;
    album: MockProxy<Window["api"]["album"]>;
    film: MockProxy<Window["api"]["film"]>;
};
export const mockedAPI = (): MockedAPI => {
    return {
        fs: mock<Window["api"]["fs"]>(),
        album: mock<Window["api"]["album"]>(),
        film: mock<Window["api"]["film"]>(),
    };
};
