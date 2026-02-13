import { describe, it } from "vitest";
import { testAction } from "../../test-util/util";
import {
    clearForm,
    clearFormError,
    closeModal,
    createNotification,
    deleteNotification,
    formError,
    navigate,
    openModal,
    toggleNavMenu,
    updateForm,
} from "../../../src/infra/actions/ui";
import {
    CLEAR_FORM,
    CLEAR_FORM_ERROR,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    DELETE_NOTIFICATION,
    FORM_ERROR,
    NAVIGATE,
    OPEN_MODAL,
    TOGGLE_NAV_MENU,
    UPDATE_FORM,
} from "../../../src/infra/events";

describe("Ui actions", () => {
    it("Should expose actions", () => {
        testAction(navigate, NAVIGATE, { to: ["here"] });
        testAction(toggleNavMenu, TOGGLE_NAV_MENU, { menu: "123" });
        testAction(openModal, OPEN_MODAL, { modalId: "123" });
        testAction(closeModal, CLOSE_MODAL);
        testAction(formError, FORM_ERROR, { formId: "123", error: "error" });
        testAction(updateForm, UPDATE_FORM, { formId: "123", values: {} });
        testAction(clearFormError, CLEAR_FORM_ERROR, { formId: "123" });
        testAction(clearForm, CLEAR_FORM, { formId: "123" });
        testAction(createNotification, CREATE_NOTIFICATION, {
            type: "success",
            message: "message",
        });
        testAction(deleteNotification, DELETE_NOTIFICATION, {
            id: "123",
        });
    });
});
