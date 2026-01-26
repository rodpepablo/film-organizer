export interface IFSService {
    getFile: () => Promise<string | null>;
}
