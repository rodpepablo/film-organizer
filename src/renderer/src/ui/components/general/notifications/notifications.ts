import "./notifications.css";
import { html } from "@html";
import { State, Emit } from "../../../../../../domain/models/state";
import { uiNotificationsSelector } from "../../../../selectors/ui";
import { Notification } from "../../../../../../domain/models/ui";

function notification(notification: Notification) {
    return html`
        <span class="notification" type="${notification.type}">
            ${notification.message}
        </span>
    `;
}

export default function(state: State, emit: Emit) {
    const notifications = uiNotificationsSelector(state);

    return html`
        <section class="notifications">
            ${notifications.map(notification)}
        </section>
    `;
}
