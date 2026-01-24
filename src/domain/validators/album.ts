import { INVALID_ALBUM_NAME } from "../../infra/errors";
import { ValidationResult, Validator } from "../models/validation";

class CreateAlbumValidator implements Validator {
    validate(data: any): ValidationResult {
        if (data.name.length == 0 || data.name.length > 25) {
            return [false, { msg: INVALID_ALBUM_NAME }];
        }

        return [true, null];
    }
}

export const AlbumValidators = {
    albumCreation: new CreateAlbumValidator(),
};
