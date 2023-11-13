import type { FieldValues, ResponseData, FormStore, Maybe, FieldPath, FieldArrayPath } from '../types';
/**
 * Value type of the validate options.
 */
export type ValidateOptions = Partial<{
    shouldActive: boolean;
    shouldFocus: boolean;
}>;
/**
 * Validates the entire form.
 *
 * @param form The form to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export declare function validate<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, options?: Maybe<ValidateOptions>): Promise<boolean>;
/**
 * Validates a single field or field array.
 *
 * @param form The form to be validated.
 * @param name The field or field array to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export declare function validate<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, name: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>, options?: Maybe<ValidateOptions>): Promise<boolean>;
/**
 * Validates several fields and field arrays.
 *
 * @param form The form to be validated.
 * @param names The fields and field arrays to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export declare function validate<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[], options?: Maybe<ValidateOptions>): Promise<boolean>;
