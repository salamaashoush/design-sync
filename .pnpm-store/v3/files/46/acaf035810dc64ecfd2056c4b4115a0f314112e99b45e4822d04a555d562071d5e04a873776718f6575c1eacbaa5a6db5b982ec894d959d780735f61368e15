import type { FieldArrayPath, FieldPath, FieldValues, FormErrors, FormStore, Maybe, ResponseData } from '../types';
/**
 * Value type of the get errors options.
 */
export type GetErrorsOptions = Partial<{
    shouldActive: boolean;
    shouldTouched: boolean;
    shouldDirty: boolean;
}>;
/**
 * Returns the current errors of the form fields.
 *
 * @param form The form of the fields.
 * @param options The errors options.
 *
 * @returns The form errors.
 */
export declare function getErrors<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, options?: Maybe<GetErrorsOptions>): FormErrors<TFieldValues>;
/**
 * Returns the errors of the specified field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The errors options.
 *
 * @returns The form errors.
 */
export declare function getErrors<TFieldValues extends FieldValues, TResponseData extends ResponseData, TFieldArrayName extends FieldArrayPath<TFieldValues>>(form: FormStore<TFieldValues, TResponseData>, name: TFieldArrayName, options?: Maybe<GetErrorsOptions>): FormErrors<TFieldValues>;
/**
 * Returns the current errors of the specified fields and field arrays.
 *
 * @param form The form of the fields.
 * @param names The names of the fields and field arrays.
 * @param options The errors options.
 *
 * @returns The form errors.
 */
export declare function getErrors<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[], options?: Maybe<GetErrorsOptions>): FormErrors<TFieldValues>;
