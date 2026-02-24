import { Collection } from "./collection";

export type ValidationResult = [boolean, { msg: string }];

export interface Validator {
    validate(data: any): ValidationResult;
}

export interface WithContext {
    context: any;
    withContext(collection: any): Validator;
}

export class ValidatorWithCollectionContext implements Validator, WithContext {
    context: Collection;

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
