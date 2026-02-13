import Nanobus from "nanobus";
import { IIdGenerator, IdGenerator } from "../../infra/id-generator";
import {
    CLEAR_FORM_ERROR,
    CLEAR_FORM,
    CLOSE_MODAL,
    CREATE_NOTIFICATION,
    DELETE_NOTIFICATION,
    FORM_ERROR,
    NAVIGATE,
    OPEN_MODAL,
    TOGGLE_NAV_MENU,
    UPDATE_FORM,
} from "../../infra/events";
import { Emit, EventParams, State } from "../models/state";
import { Notification } from "../models/ui";
import config from "../../infra/config";
import { deleteNotification } from "../../infra/actions/ui";

export type NavigateParams = EventParams & {
    to: string[];
};

export type ToggleNavMenuParams = EventParams & {
    menu: string;
};

export type OpenModalParams = EventParams & {
    modalId: string;
};

export type FormEventParams = EventParams & {
    formId: string;
};

export type FormErrorParams = FormEventParams & {
    error: string;
};

export type FormUpdateParams = FormEventParams & {
    values: Record<string, any>;
};

export type DeleteNotificationParams = EventParams & Pick<Notification, "id">;
export type CreateNotificationParams = EventParams &
    Pick<Notification, "type" | "message">;

type Substate = Pick<
    State,
    "location" | "menus" | "modal" | "forms" | "notifications"
>;

export class UIStoreManager {
    state: Substate;
    emit: Emit;
    idGenerator: IIdGenerator;
    setTimout: Function;

    constructor(
        state: Substate,
        emitter: Nanobus,
        idGenerator: IIdGenerator,
        _setTimout: Function,
    ) {
        this.state = state;
        this.emit = emitter.emit.bind(emitter);
        this.idGenerator = idGenerator;
        this.setTimout = _setTimout;
    }

    navigate = (params: NavigateParams) => {
        this.state.location = params.to;
        this.emit("render");
    };

    toggleNavmenu = (params: ToggleNavMenuParams) => {
        if (params.menu in this.state.menus) {
            this.state.menus[params.menu] = !this.state.menus[params.menu];
        }
        this.emit("render");
    };

    openModal = (params: OpenModalParams) => {
        this.state.modal.active = true;
        this.state.modal.modalId = params.modalId;
        this.emit("render");
    };

    closeModal = () => {
        this.state.modal.active = false;
        this.state.modal.modalId = null;
        this.emit("render");
    };

    formError = (params: FormErrorParams) => {
        this.initForm(params);
        this.state.forms[params.formId].error = params.error;
        this.emit("render");
    };

    updateForm = (params: FormUpdateParams) => {
        this.initForm(params);
        this.state.forms[params.formId].values = params.values;
    };

    clearFormError = (params: FormEventParams) => {
        this.initForm(params);
        this.state.forms[params.formId].error = null;
        this.emit("render");
    };

    clearForm = (params: FormEventParams) => {
        if (params.formId in this.state.forms) {
            this.state.forms[params.formId] = {
                error: null,
                values: {},
            };
            this.emit("render");
        }
    };

    createNotification = (params: CreateNotificationParams) => {
        const id = this.idGenerator.generate();
        this.state.notifications.push({
            id,
            ...params,
        });
        this.setTimout(() => {
            deleteNotification(this.emit, { id });
        }, config.notifications.ttl);
        this.emit("render");
    };

    deleteNotification = (params: DeleteNotificationParams) => {
        this.state.notifications = this.state.notifications.filter(
            (notification) => notification.id !== params.id,
        );
        this.emit("render");
    };

    private initForm(params: FormEventParams) {
        if (!(params.formId in this.state.forms)) {
            this.state.forms[params.formId] = {
                error: null,
                values: {},
            };
        }
    }
}

export function uiStore(state: Substate, emitter: Nanobus): void {
    const idGenerator = new IdGenerator();
    const timeout =
        process.env.NODE_ENV !== "test" ? window.setTimeout.bind(window) : () => { };
    const manager = new UIStoreManager(state, emitter, idGenerator, timeout);

    emitter.on(NAVIGATE, manager.navigate);
    emitter.on(TOGGLE_NAV_MENU, manager.toggleNavmenu);
    emitter.on(OPEN_MODAL, manager.openModal);
    emitter.on(CLOSE_MODAL, manager.closeModal);
    emitter.on(FORM_ERROR, manager.formError);
    emitter.on(UPDATE_FORM, manager.updateForm);
    emitter.on(CLEAR_FORM_ERROR, manager.clearFormError);
    emitter.on(CLEAR_FORM, manager.clearForm);
    emitter.on(CREATE_NOTIFICATION, manager.createNotification);
    emitter.on(DELETE_NOTIFICATION, manager.deleteNotification);
}
