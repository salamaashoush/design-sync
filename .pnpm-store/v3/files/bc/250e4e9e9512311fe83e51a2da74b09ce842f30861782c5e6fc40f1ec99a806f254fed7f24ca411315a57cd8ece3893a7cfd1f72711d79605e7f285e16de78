/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/TabsKeyboardDelegate.ts
 */
export class TabsKeyboardDelegate {
    collection;
    direction;
    orientation;
    constructor(collection, direction, orientation) {
        this.collection = collection;
        this.direction = direction;
        this.orientation = orientation;
    }
    flipDirection() {
        return this.direction() === "rtl" && this.orientation() === "horizontal";
    }
    getKeyLeftOf(key) {
        if (this.flipDirection()) {
            return this.getNextKey(key);
        }
        else {
            if (this.orientation() === "horizontal") {
                return this.getPreviousKey(key);
            }
            return undefined;
        }
    }
    getKeyRightOf(key) {
        if (this.flipDirection()) {
            return this.getPreviousKey(key);
        }
        else {
            if (this.orientation() === "horizontal") {
                return this.getNextKey(key);
            }
            return undefined;
        }
    }
    getKeyAbove(key) {
        if (this.orientation() === "vertical") {
            return this.getPreviousKey(key);
        }
        return undefined;
    }
    getKeyBelow(key) {
        if (this.orientation() === "vertical") {
            return this.getNextKey(key);
        }
        return undefined;
    }
    getFirstKey() {
        let key = this.collection().getFirstKey();
        if (key == null) {
            return;
        }
        const item = this.collection().getItem(key);
        if (item?.disabled) {
            key = this.getNextKey(key);
        }
        return key;
    }
    getLastKey() {
        let key = this.collection().getLastKey();
        if (key == null) {
            return;
        }
        const item = this.collection().getItem(key);
        if (item?.disabled) {
            key = this.getPreviousKey(key);
        }
        return key;
    }
    getNextKey(key) {
        let nextKey = key;
        let nextItem;
        do {
            nextKey = this.collection().getKeyAfter(nextKey) ?? this.collection().getFirstKey();
            if (nextKey == null) {
                return;
            }
            nextItem = this.collection().getItem(nextKey);
            if (nextItem == null) {
                return;
            }
        } while (nextItem.disabled);
        return nextKey;
    }
    getPreviousKey(key) {
        let previousKey = key;
        let previousItem;
        do {
            previousKey = this.collection().getKeyBefore(previousKey) ?? this.collection().getLastKey();
            if (previousKey == null) {
                return;
            }
            previousItem = this.collection().getItem(previousKey);
            if (previousItem == null) {
                return;
            }
        } while (previousItem.disabled);
        return previousKey;
    }
}
