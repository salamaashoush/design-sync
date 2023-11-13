/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/dismissable-layer.ts
 */
import { contains, getDocument, mergeRefs } from "@kobalte/utils";
import { createEffect, on, onCleanup, onMount, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { createEscapeKeyDown, createInteractOutside, } from "../primitives";
import { DismissableLayerContext, useOptionalDismissableLayerContext, } from "./dismissable-layer-context";
import { layerStack } from "./layer-stack";
export function DismissableLayer(props) {
    let ref;
    const parentContext = useOptionalDismissableLayerContext();
    const [local, others] = splitProps(props, [
        "ref",
        "disableOutsidePointerEvents",
        "excludedElements",
        "onEscapeKeyDown",
        "onPointerDownOutside",
        "onFocusOutside",
        "onInteractOutside",
        "onDismiss",
        "bypassTopMostLayerCheck",
    ]);
    const nestedLayers = new Set([]);
    const registerNestedLayer = (element) => {
        nestedLayers.add(element);
        const parentUnregister = parentContext?.registerNestedLayer(element);
        return () => {
            nestedLayers.delete(element);
            parentUnregister?.();
        };
    };
    const shouldExcludeElement = (element) => {
        if (!ref) {
            return false;
        }
        return (local.excludedElements?.some(node => contains(node(), element)) ||
            [...nestedLayers].some(layer => contains(layer, element)));
    };
    const onPointerDownOutside = (e) => {
        if (!ref || layerStack.isBelowPointerBlockingLayer(ref)) {
            return;
        }
        if (!local.bypassTopMostLayerCheck && !layerStack.isTopMostLayer(ref)) {
            return;
        }
        local.onPointerDownOutside?.(e);
        local.onInteractOutside?.(e);
        if (!e.defaultPrevented) {
            local.onDismiss?.();
        }
    };
    const onFocusOutside = (e) => {
        local.onFocusOutside?.(e);
        local.onInteractOutside?.(e);
        if (!e.defaultPrevented) {
            local.onDismiss?.();
        }
    };
    createInteractOutside({
        shouldExcludeElement,
        onPointerDownOutside,
        onFocusOutside,
    }, () => ref);
    createEscapeKeyDown({
        ownerDocument: () => getDocument(ref),
        onEscapeKeyDown: e => {
            if (!ref || !layerStack.isTopMostLayer(ref)) {
                return;
            }
            local.onEscapeKeyDown?.(e);
            if (!e.defaultPrevented && local.onDismiss) {
                e.preventDefault();
                local.onDismiss();
            }
        },
    });
    onMount(() => {
        if (!ref) {
            return;
        }
        layerStack.addLayer({
            node: ref,
            isPointerBlocking: local.disableOutsidePointerEvents,
            dismiss: local.onDismiss,
        });
        const unregisterFromParentLayer = parentContext?.registerNestedLayer(ref);
        layerStack.assignPointerEventToLayers();
        layerStack.disableBodyPointerEvents(ref);
        onCleanup(() => {
            if (!ref) {
                return;
            }
            layerStack.removeLayer(ref);
            unregisterFromParentLayer?.();
            // Re-assign pointer event to remaining layers.
            layerStack.assignPointerEventToLayers();
            layerStack.restoreBodyPointerEvents(ref);
        });
    });
    createEffect(on([() => ref, () => local.disableOutsidePointerEvents], ([ref, disableOutsidePointerEvents]) => {
        if (!ref) {
            return;
        }
        const layer = layerStack.find(ref);
        if (layer && layer.isPointerBlocking !== disableOutsidePointerEvents) {
            // Keep layer in sync with the prop.
            layer.isPointerBlocking = disableOutsidePointerEvents;
            // Update layers pointer-events since this layer "isPointerBlocking" has changed.
            layerStack.assignPointerEventToLayers();
        }
        if (disableOutsidePointerEvents) {
            layerStack.disableBodyPointerEvents(ref);
        }
        onCleanup(() => {
            layerStack.restoreBodyPointerEvents(ref);
        });
    }, {
        defer: true,
    }));
    const context = {
        registerNestedLayer,
    };
    return (<DismissableLayerContext.Provider value={context}>
      <Polymorphic as="div" ref={mergeRefs(el => (ref = el), local.ref)} {...others}/>
    </DismissableLayerContext.Provider>);
}
