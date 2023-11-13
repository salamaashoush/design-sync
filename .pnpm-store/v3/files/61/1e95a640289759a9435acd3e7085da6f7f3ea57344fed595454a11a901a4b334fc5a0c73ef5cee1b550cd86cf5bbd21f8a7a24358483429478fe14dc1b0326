import type { FieldArrayPath, FieldArrayPathValue, FieldValues, FormStore, Maybe, ResponseData } from '../types';
/**
 * Value type of the insert options.
 */
export type InsertOptions<TFieldValues extends FieldValues, TFieldArrayName extends FieldArrayPath<TFieldValues>> = {
    at?: Maybe<number>;
    value: FieldArrayPathValue<TFieldValues, TFieldArrayName>[number];
};
/**
 * Inserts a new item into the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The insert options.
 */
export declare function insert<TFieldValues extends FieldValues, TResponseData extends ResponseData, TFieldArrayName extends FieldArrayPath<TFieldValues>>(form: FormStore<TFieldValues, TResponseData>, name: TFieldArrayName, options: InsertOptions<TFieldValues, TFieldArrayName>): void;
