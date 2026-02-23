export interface IDateWrapper {
    now(): string;
}

export default class DateWrapper implements IDateWrapper {
    now(): string {
        return new Date().toISOString();
    }
}
