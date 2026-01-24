export interface Menus {
    [key: string]: boolean;
}

export interface Modal {
    active: boolean;
    modalId: string | null;
}

export interface Form {
    error?: string | null;
}

export interface Forms {
    [key: string]: Form;
}
