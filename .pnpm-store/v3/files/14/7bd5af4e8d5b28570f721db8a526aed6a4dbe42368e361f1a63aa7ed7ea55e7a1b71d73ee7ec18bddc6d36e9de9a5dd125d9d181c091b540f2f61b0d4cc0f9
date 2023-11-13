import type { FieldArrayPath, FieldPath, FieldValues, FormStore, Maybe, ResponseData } from '../types';
/**
 * Returns a tuple with filtered field and field array names. For each
 * specified field array name, the names of the contained fields and field
 * arrays are also returned. If no name is specified, the name of each field
 * and field array of the form is returned.
 *
 * @param form The form of the fields.
 * @param arg2 The name of the fields.
 * @param shouldValid Whether to be valid.
 *
 * @returns A tuple with filtered names.
 */
export declare function getFilteredNames<TFieldValues extends FieldValues, TResponseData extends ResponseData, TOptions extends Record<string, any>>(form: FormStore<TFieldValues, TResponseData>, arg2?: Maybe<FieldPath<TFieldValues> | FieldArrayPath<TFieldValues> | (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[] | TOptions>, shouldValid?: Maybe<boolean>): [FieldPath<TFieldValues>[], FieldArrayPath<TFieldValues>[]];
