/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/collections/src/useCollection.ts
 */
import { Accessor } from "solid-js";
import { Collection, CollectionBase, CollectionNode } from "./types";
type CollectionFactory<C extends Collection<CollectionNode>> = (node: Iterable<CollectionNode>) => C;
export interface CreateCollectionProps<C extends Collection<CollectionNode>> extends CollectionBase {
    factory: CollectionFactory<C>;
}
export declare function createCollection<C extends Collection<CollectionNode>>(props: CreateCollectionProps<C>, deps?: Array<Accessor<any>>): Accessor<C>;
export {};
