import { getPathIndex } from '../utils';
/**
 * Returns a function that sorts field names by their array path index.
 *
 * @param name The name of the field array.
 *
 * @returns The sort function.
 */
export function sortArrayPathIndex(name) {
    return (pathA, pathB) => getPathIndex(name, pathA) - getPathIndex(name, pathB);
}
