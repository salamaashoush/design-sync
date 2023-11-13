import type { FieldPath, FieldPathValue, FieldValues, FormStore, Maybe, ResponseData } from '../types';
/**
 * Value type of the set value options.
 */
export type SetValueOptions = Partial<{
    shouldTouched: boolean;
    shouldDirty: boolean;
    shouldValidate: boolean;
    shouldFocus: boolean;
}>;
/**
 * Sets the value of the specified field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param value The value to bet set.
 * @param options The value options.
 */
export declare function setValue<TFieldValues extends FieldValues, TResponseData extends ResponseData, TFieldName extends FieldPath<TFieldValues>>(form: FormStore<TFieldValues, TResponseData>, name: TFieldName, value: FieldPathValue<TFieldValues, TFieldName>, { shouldTouched, shouldDirty, shouldValidate, shouldFocus, }?: Maybe<SetValueOptions>): void;
