import "./named-value-list.css";
import { NamedValue } from "../../../../domain/models/base";
import { Emit, State } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";

export default class NamedValueList implements Component {
    private items: NamedValue[];

    constructor(items: NamedValue[]) {
        this.items = items;
    }

    render(state: State, emit: Emit): HTMLElement {
        const items = this.items.map(
            (item) => html`
            <li class="named-value-item">
                <b>${item.name}:</b>${item.value}
            </li>
        `,
        );
        return html`<ul class="named-value-list">${items}</ul>`;
    }
}
