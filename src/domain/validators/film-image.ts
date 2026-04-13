import {
    INVALID_DUPLICATED_IMAGE_NAME,
    INVALID_IMAGE_NAME,
} from "../../infra/errors";
import {
    ValidationResult,
    ValidatorWithCollectionContext,
} from "../models/validation";
import { UnknownFilmError } from "../models/errors";

class EditImageNameValidator extends ValidatorWithCollectionContext {
    validate(data: EditImageNameValidationSubject): ValidationResult {
        super.validate(data);

        if (data.name.length == 0) return [false, { msg: INVALID_IMAGE_NAME }];

        const film = this.context!.films.find((film) => film.id === data.filmId);
        if (film == null) throw new UnknownFilmError();

        const takenNames = film.images
            .filter((image) => image.id !== data.imageId)
            .map((image) => image.name);
        if (takenNames.includes(data.name))
            return [false, { msg: INVALID_DUPLICATED_IMAGE_NAME }];

        return [true, null];
    }
}

export const ImageValidators = {
    imageNameEdit: new EditImageNameValidator(),
};

type EditImageNameValidationSubject = {
    name: string;
    filmId: string;
    imageId: string;
};
