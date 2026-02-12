import { INVALID_FILM_NAME } from "../../infra/errors";
import { ValidationResult, Validator } from "../models/validation";

class EditFilmNameValidator implements Validator {
    validate(data: any): ValidationResult {
        if (data.name.length == 0) {
            return [false, { msg: INVALID_FILM_NAME }];
        }

        return [true, null];
    }
}

export const FilmValidators = {
    filmNameEdit: new EditFilmNameValidator(),
};
