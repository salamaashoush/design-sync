/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/Selection.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/types.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-types/shared/src/selection.d.ts
 */
/**
 * A Selection is a special Set containing Keys, which also has an anchor
 * and current selected key for use when range selecting.
 */
export class Selection extends Set {
    anchorKey;
    currentKey;
    constructor(keys, anchorKey, currentKey) {
        super(keys);
        if (keys instanceof Selection) {
            this.anchorKey = anchorKey || keys.anchorKey;
            this.currentKey = currentKey || keys.currentKey;
        }
        else {
            this.anchorKey = anchorKey;
            this.currentKey = currentKey;
        }
    }
}
