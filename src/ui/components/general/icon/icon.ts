import "./icon.css";
import { State, Emit } from "../../../../domain/models/state";
import Component from "../../../../infra/component";
import { html } from "../../../../infra/html";

type IconProps = {
    type?: "actionable";
    icon: string;
    onClick?: (e: DOMEvent) => void;
};

export default class Icon implements Component {
    props: IconProps;

    constructor(props: IconProps) {
        this.props = props;
    }

    render(state: State, emit: Emit): HTMLElement {
        const onClick = this.props.onClick;
        return html`
            <iconify-icon
                class="${this.props.type}"
                icon="${this.props.icon}"
                onclick=${onClick}>
            </iconify-icon>
        `;
    }
}
