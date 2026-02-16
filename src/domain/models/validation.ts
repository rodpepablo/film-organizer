import { Album } from "./album";

export type ValidationResult = [boolean, { msg: string }];

export interface Validator {
    validate(data: any): ValidationResult;
}

export interface WithContext {
    context: any;
    withContext(album: any): Validator;
}

export class ValidatorWithAlbumContext implements Validator, WithContext {
    context: Album;

    withContext(context: Album): Validator {
        this.context = context;
        return this;
    }

    validate(data: any): ValidationResult {
        if (this.context == null)
            throw new Error("Context should be set before validating");
        return [true, null];
    }
}
