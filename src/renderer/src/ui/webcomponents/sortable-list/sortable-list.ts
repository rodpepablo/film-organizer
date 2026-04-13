import Sortable, { SortableEvent } from "sortablejs";

export class SortableList extends HTMLElement {
    private sortable?: Sortable;

    constructor() {
        super();
    }

    connectedCallback() {
        this.initializeSortable();
    }

    disconnectedCallback() {
        this.sortable?.destroy();
    }

    private initializeSortable() {
        this.sortable = Sortable.create(this, {
            onEnd: (e: SortableEvent) => {
                this.dispatchEvent(
                    new CustomEvent("sorted", {
                        bubbles: true,
                        composed: true,
                        detail: {
                            newOrder: this.sortable.toArray(),
                            oldIndex: e.oldIndex,
                            newIndex: e.newIndex,
                        },
                    }),
                );
            },
        });
    }
}

customElements.define("sortable-list", SortableList);
