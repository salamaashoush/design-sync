/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/TabsKeyboardDelegate.ts
 */
import { Orientation } from "@kobalte/utils";
import { Accessor } from "solid-js";
import { Direction } from "../i18n";
import { Collection, CollectionNode } from "../primitives";
import { KeyboardDelegate } from "../selection";
export declare class TabsKeyboardDelegate implements KeyboardDelegate {
    private collection;
    private direction;
    private orientation;
    constructor(collection: Accessor<Collection<CollectionNode>>, direction: Accessor<Direction>, orientation: Accessor<Orientation>);
    private flipDirection;
    getKeyLeftOf(key: string): string;
    getKeyRightOf(key: string): string;
    getKeyAbove(key: string): string;
    getKeyBelow(key: string): string;
    getFirstKey(): string;
    getLastKey(): string;
    getNextKey(key: string): string;
    getPreviousKey(key: string): string;
}
