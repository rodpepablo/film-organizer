import { expect, vi } from "vitest";
import { Emit } from "../../src/domain/models/state";
import { EventParams } from "../../src/domain/models/state";

export const testAction = (
    action: (emit: Emit, params?: any) => void,
    event: string,
    params?: EventParams,
) => {
    const emit = vi.fn();
    if (params != null) {
        action(emit, params);
        expect(emit).toHaveBeenCalledWith(event, params);
    } else {
        action(emit);
        expect(emit).toHaveBeenCalledWith(event);
    }
};

export function testHasInputs(
    dom: HTMLElement,
    expectedInputs: { name: string; type: string }[],
) {
    const inputs = Array.from(
        dom.querySelectorAll<HTMLInputElement>("input"),
    ).map((input) => ({
        type: input.type,
        name: input.name,
    }));

    expect(inputs).toHaveLength(expectedInputs.length);
    for (let input of inputs) {
        expect(expectedInputs).toContainEqual(input);
    }
}
