import type { FieldArrayPath, FieldValues, FormStore, Maybe, ResponseData } from '../types';
/**
 * Value type of the has field array options.
 */
export type HasFieldArrayOptions = Partial<{
    shouldActive: boolean;
    shouldTouched: boolean;
    shouldDirty: boolean;
    shouldValid: boolean;
}>;
/**
 * Checks if the specified field array is included in the form.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The field array options.
 *
 * @returns Whether the field array is included.
 */
export declare function hasFieldArray<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, name: FieldArrayPath<TFieldValues>, { shouldActive, shouldTouched, shouldDirty, shouldValid, }?: Maybe<HasFieldArrayOptions>): boolean;
