import { NamedEntity } from "../models/base";
import { Collection } from "../models/collection";

export interface IRenamerService {
    rename(entities: NamedEntity[], template: string): NamedEntity[];
}

export interface IContextExtractor {
    templateElement: string;
    helpText: string;
    extract(collection: Collection, image: NamedEntity): string;
}
