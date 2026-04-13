import { Collection } from "./collection";

export type ValidationResult = [false, { msg: string }] | [true, null];

export interface Validator {
    validate(data: any): ValidationResult;
}

export class ValidatorWithCollectionContext implements Validator {
    context?: Collection;

    withContext(context: Collection): Validator {
        this.context = context;
        return this;
    }

    validate(data: any): ValidationResult {
        if (this.context == null)
            throw new Error("Context should be set before validating");
        return [true, null];
    }
}
