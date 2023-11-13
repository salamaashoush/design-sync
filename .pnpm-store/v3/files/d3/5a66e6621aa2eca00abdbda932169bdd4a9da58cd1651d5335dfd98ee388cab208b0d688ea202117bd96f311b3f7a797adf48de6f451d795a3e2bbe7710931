import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";
import { useDomCollectionContext } from "./dom-collection-context";
export function createDomCollectionItem(props) {
    const context = useDomCollectionContext();
    props = mergeDefaultProps({ shouldRegisterItem: true }, props);
    createEffect(() => {
        if (!props.shouldRegisterItem) {
            return;
        }
        const unregister = context.registerItem(props.getItem());
        onCleanup(unregister);
    });
}
