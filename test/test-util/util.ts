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
