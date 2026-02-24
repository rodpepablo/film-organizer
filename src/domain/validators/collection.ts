import { INVALID_COLLECTION_NAME } from "../../infra/errors";
import { ValidationResult, Validator } from "../models/validation";

class CreateCollectionValidator implements Validator {
    validate(data: any): ValidationResult {
        if (data.name.length == 0 || data.name.length > 25) {
            return [false, { msg: INVALID_COLLECTION_NAME }];
        }

        return [true, null];
    }
}

export const CollectionValidators = {
    collectionCreation: new CreateCollectionValidator(),
};
