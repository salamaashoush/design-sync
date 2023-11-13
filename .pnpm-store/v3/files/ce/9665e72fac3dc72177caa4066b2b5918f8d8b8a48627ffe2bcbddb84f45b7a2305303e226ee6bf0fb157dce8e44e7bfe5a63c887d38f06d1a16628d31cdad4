/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/ListCollection.ts
 */
import { Collection, CollectionNode } from "../primitives";
export declare class ListCollection implements Collection<CollectionNode> {
    private keyMap;
    private iterable;
    private firstKey?;
    private lastKey?;
    constructor(nodes: Iterable<CollectionNode>);
    [Symbol.iterator](): Generator<CollectionNode<any>, void, undefined>;
    getSize(): number;
    getKeys(): IterableIterator<string>;
    getKeyBefore(key: string): string;
    getKeyAfter(key: string): string;
    getFirstKey(): string;
    getLastKey(): string;
    getItem(key: string): CollectionNode<any>;
    at(idx: number): CollectionNode<any>;
}
