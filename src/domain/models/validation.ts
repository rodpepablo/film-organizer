export type ValidationResult = [boolean, { msg: string }];

export interface Validator {
    validate: (data: any) => ValidationResult;
}
