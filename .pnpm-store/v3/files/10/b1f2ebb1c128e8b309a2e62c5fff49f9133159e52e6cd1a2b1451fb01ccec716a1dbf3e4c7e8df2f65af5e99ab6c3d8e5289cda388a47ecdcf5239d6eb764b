/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-stately/collections/src/getItemCount.ts
 */
const cache = new WeakMap();
export function getItemCount(collection) {
    let count = cache.get(collection);
    if (count != null) {
        return count;
    }
    count = 0;
    for (const item of collection) {
        if (item.type === "item") {
            count++;
        }
    }
    cache.set(collection, count);
    return count;
}
