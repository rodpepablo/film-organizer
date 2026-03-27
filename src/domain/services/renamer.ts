import { NamedEntity, NamedValue } from "../models/base";
import { Collection } from "../models/collection";
import { IContextExtractor, IRenamerService } from "../ports/renamer";
import {
    imageIndexExtractor,
    filmIndexExtractor,
    cameraExtractor,
    filmStockExtractor,
    lensExtractor,
    shotISOExtractor,
    filmExpirationExtractor,
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

class RenamerService implements IRenamerService {
    private context: Collection;
    static extractorTemplates: string[] = [];
    static extractors: Record<string, IContextExtractor> = {};

    constructor(context: Collection) {
        this.context = context;
    }

    rename(entities: NamedEntity[], template: string): NamedEntity[] {
        const parsedTemplate = this.parseTemplate(template);
        const renamedEntities = parsedTemplate.rename(entities, this.context);
        this.checkForDuplicities(renamedEntities);

        return renamedEntities;
    }

    static registerExtractor(extractor: IContextExtractor) {
        this.extractorTemplates.push(extractor.templateElement);
        this.extractors[extractor.templateElement] = extractor;
    }

    static getAvailableOptions(): NamedValue[] {
        const extractors = this.extractors;
        return Object.values(extractors).map((extractor) => ({
            name: `%${extractor.templateElement}`,
            value: extractor.helpText,
        }));
    }

    private parseTemplate(template: string): Template {
        const parts = template.split("%");
        const results = new Template();
        const extractorTemplates = (this.constructor as typeof RenamerService)
            .extractorTemplates;
        const extractors = (this.constructor as typeof RenamerService).extractors;

        results.add(parts[0]);
        parts.slice(1).forEach((part) => {
            const extractorTemplate = extractorTemplates.find((t) =>
                part.toLowerCase().startsWith(t.toLowerCase()),
            );

            if (extractorTemplate == null)
                throw new UnregisteredPropExtractorError(part);

            results.add(extractors[extractorTemplate]);
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

export class UnregisteredPropExtractorError extends Error { }

export class NonInjectiveTemplateError extends Error { }

export class ImageRenamerService extends RenamerService {
    static extractorTemplates: string[] = [];
    static extractors: Record<string, IContextExtractor> = {};
}

ImageRenamerService.registerExtractor(imageIndexExtractor);
ImageRenamerService.registerExtractor(filmIndexExtractor);
ImageRenamerService.registerExtractor(cameraExtractor);
ImageRenamerService.registerExtractor(filmStockExtractor);
ImageRenamerService.registerExtractor(lensExtractor);
ImageRenamerService.registerExtractor(shotISOExtractor);
ImageRenamerService.registerExtractor(filmExpirationExtractor);
