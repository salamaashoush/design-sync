import type { FieldPath, FieldValues, FormStore, Maybe, ResponseData } from '../types';
/**
 * Value type of the has field options.
 */
export type HasFieldOptions = Partial<{
    shouldActive: boolean;
    shouldTouched: boolean;
    shouldDirty: boolean;
    shouldValid: boolean;
}>;
/**
 * Checks if the specified field is included in the form.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param options The field options.
 *
 * @returns Whether the field is included.
 */
export declare function hasField<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, name: FieldPath<TFieldValues>, { shouldActive, shouldTouched, shouldDirty, shouldValid, }?: Maybe<HasFieldOptions>): boolean;
