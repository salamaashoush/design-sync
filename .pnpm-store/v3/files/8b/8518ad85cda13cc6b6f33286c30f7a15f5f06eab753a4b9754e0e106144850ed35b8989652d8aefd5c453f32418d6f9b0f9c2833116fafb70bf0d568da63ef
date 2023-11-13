import type { FieldValues, FormErrors, Maybe } from '../types';
/**
 * An explicit form error with useful information for the user.
 */
export declare class FormError<TFieldValues extends FieldValues> extends Error {
    readonly name = "FormError";
    readonly errors: FormErrors<TFieldValues>;
    /**
     * Creates an explicit form error with useful information for the user.
     *
     * @param message The error message.
     * @param errors The field errors.
     */
    constructor(message: string, errors?: Maybe<FormErrors<TFieldValues>>);
    /**
     * Creates an explicit form error with useful information for the user.
     *
     * @param errors The field errors.
     */
    constructor(errors: FormErrors<TFieldValues>);
}
