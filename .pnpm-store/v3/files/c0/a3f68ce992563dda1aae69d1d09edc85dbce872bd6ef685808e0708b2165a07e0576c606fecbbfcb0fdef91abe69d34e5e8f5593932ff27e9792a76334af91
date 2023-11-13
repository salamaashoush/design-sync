import type { FieldArrayPath, FieldArrayPathValue, FieldValues, FormStore, ResponseData } from '../types';
/**
 * Value type of the value options.
 */
type ValueOptions<TFieldValues extends FieldValues, TFieldArrayName extends FieldArrayPath<TFieldValues>> = {
    at: number;
    value: FieldArrayPathValue<TFieldValues, TFieldArrayName>[number];
};
/**
 * Sets the specified field array value to the corresponding field and field
 * array stores.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The value options.
 */
export declare function setFieldArrayValue<TFieldValues extends FieldValues, TResponseData extends ResponseData, TFieldArrayName extends FieldArrayPath<TFieldValues>>(form: FormStore<TFieldValues, TResponseData>, name: TFieldArrayName, { at: index, value }: ValueOptions<TFieldValues, TFieldArrayName>): void;
export {};
