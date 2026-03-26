import { NamedEntity } from "../models/base";
import { Collection } from "../models/collection";
import { IContextExtractor, IRenamerService } from "../ports/renamer";
import {
    CameraExtractor,
    FilmIndexExtractor,
    ImageIndexExtractor,
} from "./context-extractors";

class Template {
    private parts: (string | IContextExtractor)[];

    constructor() {
        this.parts = [];
    }

    add(part: string | IContextExtractor) {
        this.parts.push(part);
    }

    rename(entities: NamedEntity[], context: Collection): NamedEntity[] {
        return entities.map((entity) => {
            const parsed = this.parts.map((result) => {
                if (typeof result === "string") {
                    return result;
                } else {
                    return result.extract(context, entity);
                }
            });

            return {
                ...entity,
                name: parsed.join(""),
            };
        });
    }
}

export class RenamerService implements IRenamerService {
    private context: Collection;
    protected extractorTemplates: string[];
    protected extractors: Record<string, IContextExtractor>;

    constructor(context: Collection) {
        this.context = context;
        this.extractorTemplates = [];
        this.extractors = {};
    }

    rename(entities: NamedEntity[], template: string): NamedEntity[] {
        const parsedTemplate = this.parseTemplate(template);
        const renamedEntities = parsedTemplate.rename(entities, this.context);
        this.checkForDuplicities(renamedEntities);

        return renamedEntities;
    }

    protected registerExtractor(extractor: IContextExtractor) {
        this.extractorTemplates.push(extractor.templateElement);
        this.extractors[extractor.templateElement] = extractor;
    }

    private parseTemplate(template: string): Template {
        const parts = template.split("%");
        const results = new Template();

        results.add(parts[0]);
        parts.slice(1).forEach((part) => {
            const extractorTemplate = this.extractorTemplates.find((t) =>
                part.toLowerCase().startsWith(t.toLowerCase()),
            );

            if (extractorTemplate == null)
                throw new UnregisteredPropExtractorError(part);

            results.add(this.extractors[extractorTemplate]);
            results.add(part.slice(extractorTemplate.length));
        });
        return results;
    }

    private checkForDuplicities(renamed: NamedEntity[]) {
        const newNames = renamed.map((entity) => entity.name);
        if (new Set(newNames).size < newNames.length)
            throw new NonInjectiveTemplateError();
    }
}

export default class ImageRenamerService extends RenamerService {
    constructor(context: Collection) {
        super(context);
        this.registerExtractor(new ImageIndexExtractor());
        this.registerExtractor(new FilmIndexExtractor());
        this.registerExtractor(new CameraExtractor());
    }
}

export class UnregisteredPropExtractorError extends Error { }

export class NonInjectiveTemplateError extends Error { }
