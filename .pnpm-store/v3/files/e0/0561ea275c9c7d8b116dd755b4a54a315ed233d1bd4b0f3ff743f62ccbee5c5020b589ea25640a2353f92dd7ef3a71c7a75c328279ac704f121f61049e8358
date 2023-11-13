import type { FieldArrayPath, FieldValues, FormStore, ResponseData } from '../types';
/**
 * Value type of the move options.
 */
export type MoveOptions = {
    from: number;
    to: number;
};
/**
 * Moves a field of the field array to a new position and rearranges all fields
 * in between.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The move options.
 */
export declare function move<TFieldValues extends FieldValues, TResponseData extends ResponseData>(form: FormStore<TFieldValues, TResponseData>, name: FieldArrayPath<TFieldValues>, { from: fromIndex, to: toIndex }: MoveOptions): void;
