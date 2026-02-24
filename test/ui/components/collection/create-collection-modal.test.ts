import { describe, it, expect, vi } from "vitest";
import { State } from "../../../../src/domain/models/state";
import { CREATE_COLLECTION_FORM } from "../../../../src/infra/constants";
import {
    CREATE_COLLECTION_REQUEST,
    UPDATE_FORM,
} from "../../../../src/infra/events";
import CreateCollectionModal from "../../../../src/ui/components/collection/create-collection-modal/create-collection-modal";
import { setInputValueTo, submitForm } from "../../../test-util/dom";

const DUMMY_STATE = { forms: {} } as State;

describe("Create collection modal", () => {
    it("Should emit a create event with the form info", () => {
        const modal = new CreateCollectionModal();
        const emit = vi.fn();

        const dom = modal.render(DUMMY_STATE, emit);
        setInputValueTo(dom, "name", "NAME");
        submitForm(dom);

        expect(emit).toHaveBeenCalledWith(UPDATE_FORM, {
            formId: CREATE_COLLECTION_FORM,
            values: {
                name: "NAME",
            },
        });
        expect(emit).toHaveBeenCalledWith(CREATE_COLLECTION_REQUEST);
    });
});
