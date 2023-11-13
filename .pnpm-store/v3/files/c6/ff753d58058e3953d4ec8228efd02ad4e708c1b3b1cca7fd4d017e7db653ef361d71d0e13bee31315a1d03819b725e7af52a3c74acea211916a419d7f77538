import type { FieldArrayPath, FieldArrayPathValue, FieldValues, FormStore, Maybe, PartialValues, ResponseData } from '../types';
/**
 * Value type of the set values options.
 */
export type SetValuesOptions = Partial<{
    shouldTouched: boolean;
    shouldDirty: boolean;
    shouldValidate: boolean;
    shouldFocus: boolean;
}>;
/**
 * Sets multiple values of the form at once.
 *
 * @param form The form store.
 * @param values The values to be set.
 * @param options The values options.
 */
export declare function setValues<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, values: PartialValues<TFieldValues>, options?: Maybe<SetValuesOptions>): void;
/**
 * Sets multiple values of a field array at once.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param values The values to be set.
 * @param options The values options.
 */
export declare function setValues<TFieldValues extends FieldValues, TResponseData extends ResponseData, TFieldArrayName extends FieldArrayPath<TFieldValues>>(form: FormStore<TFieldValues, TResponseData>, name: TFieldArrayName, values: FieldArrayPathValue<TFieldValues, TFieldArrayName>, options?: Maybe<SetValuesOptions>): void;
