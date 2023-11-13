import type { FieldArrayPath, FieldArrayPathValue, FieldValues, FormStore, ResponseData } from '../types';
/**
 * Value type of the replace options.
 */
export type ReplaceOptions<TFieldValues extends FieldValues, TFieldArrayName extends FieldArrayPath<TFieldValues>> = {
    at: number;
    value: FieldArrayPathValue<TFieldValues, TFieldArrayName>[number];
};
/**
 * Replaces a item of the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The replace options.
 */
export declare function replace<TFieldValues extends FieldValues, TResponseData extends ResponseData, TFieldArrayName extends FieldArrayPath<TFieldValues>>(form: FormStore<TFieldValues, TResponseData>, name: TFieldArrayName, options: ReplaceOptions<TFieldValues, TFieldArrayName>): void;
