/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/ListKeyboardDelegate.ts
 */
import { Accessor } from "solid-js";
import { Collection, CollectionNode } from "../primitives";
import { KeyboardDelegate } from "../selection";
export declare class ListKeyboardDelegate implements KeyboardDelegate {
    private collection;
    private ref?;
    private collator?;
    constructor(collection: Accessor<Collection<CollectionNode>>, ref?: Accessor<HTMLElement | undefined>, collator?: Accessor<Intl.Collator | undefined>);
    getKeyBelow(key: string): string;
    getKeyAbove(key: string): string;
    getFirstKey(): string;
    getLastKey(): string;
    private getItem;
    getKeyPageAbove(key: string): string;
    getKeyPageBelow(key: string): string;
    getKeyForSearch(search: string, fromKey?: string): string;
}
