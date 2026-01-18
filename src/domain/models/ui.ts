export interface Menus {
    [key: string]: boolean;
}

export interface Modal {
    active: boolean;
    modalId: string | null;
}
