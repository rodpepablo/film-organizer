import { INVALID_FILM_NAME, INVALID_SHOT_ISO } from "../../infra/errors";
import { EditFilmInfoValues } from "../../stores/types";
import { ValidationResult, Validator } from "../models/validation";

class EditFilmNameValidator implements Validator {
    validate(data: any): ValidationResult {
        if (data.name.length == 0) {
            return [false, { msg: INVALID_FILM_NAME }];
        }

        return [true, null];
    }
}

class EditFilmInfoValidator implements Validator {
    validate(data: EditFilmInfoValues): ValidationResult {
        if (data.shotISO != "" && !Number.isInteger(Number(data.shotISO))) {
            return [false, { msg: INVALID_SHOT_ISO }];
        }

        return [true, null];
    }
}

export const FilmValidators = {
    filmNameEdit: new EditFilmNameValidator(),
    filmInfoEdit: new EditFilmInfoValidator(),
};
