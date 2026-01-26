export interface IFSService {
    getFolder(): Promise<string | null>;
    getFile: () => Promise<string | null>;
}
