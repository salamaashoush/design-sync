/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/collections/src/useCollection.ts
 */
import { access } from "@kobalte/utils";
import { createEffect, createSignal, on } from "solid-js";
import { buildNodes } from "./utils";
export function createCollection(props, deps = []) {
    const initialNodes = buildNodes({
        dataSource: access(props.dataSource),
        getKey: access(props.getKey),
        getTextValue: access(props.getTextValue),
        getDisabled: access(props.getDisabled),
        getSectionChildren: access(props.getSectionChildren),
    });
    const [collection, setCollection] = createSignal(props.factory(initialNodes));
    createEffect(on([
        () => access(props.dataSource),
        () => access(props.getKey),
        () => access(props.getTextValue),
        () => access(props.getDisabled),
        () => access(props.getSectionChildren),
        () => props.factory,
        ...deps,
    ], ([dataSource, getKey, getTextValue, getDisabled, getSectionChildren, factory]) => {
        const nodes = buildNodes({
            dataSource,
            getKey,
            getTextValue,
            getDisabled,
            getSectionChildren,
        });
        setCollection(() => factory(nodes));
    }, {
        defer: true,
    }));
    return collection;
}
