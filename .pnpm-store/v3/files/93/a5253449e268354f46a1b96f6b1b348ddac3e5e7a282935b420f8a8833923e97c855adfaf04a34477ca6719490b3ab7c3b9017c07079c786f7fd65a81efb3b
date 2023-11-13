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
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/layer-stack.ts
 */
export interface LayerModel {
    node: HTMLElement;
    isPointerBlocking?: boolean;
    dismiss?: VoidFunction;
}
export declare const DATA_TOP_LAYER_ATTR = "data-kb-top-layer";
declare function indexOf(node: HTMLElement | undefined): number;
declare function find(node: HTMLElement | undefined): LayerModel | undefined;
declare function isTopMostLayer(node: HTMLElement | null): boolean;
declare function hasPointerBlockingLayer(): boolean;
declare function isBelowPointerBlockingLayer(node: HTMLElement): boolean;
declare function addLayer(layer: LayerModel): void;
declare function removeLayer(node: HTMLElement): void;
declare function assignPointerEventToLayers(): void;
/**
 * Disable body `pointer-events` if there are "pointer blocking" layers in the stack,
 * and body `pointer-events` has not been disabled yet.
 */
declare function disableBodyPointerEvents(node: HTMLElement): void;
/**
 * Restore body `pointer-events` style if there is no "pointer blocking" layer in the stack.
 */
declare function restoreBodyPointerEvents(node: HTMLElement): void;
export declare const layerStack: {
    layers: LayerModel[];
    isTopMostLayer: typeof isTopMostLayer;
    hasPointerBlockingLayer: typeof hasPointerBlockingLayer;
    isBelowPointerBlockingLayer: typeof isBelowPointerBlockingLayer;
    addLayer: typeof addLayer;
    removeLayer: typeof removeLayer;
    indexOf: typeof indexOf;
    find: typeof find;
    assignPointerEventToLayers: typeof assignPointerEventToLayers;
    disableBodyPointerEvents: typeof disableBodyPointerEvents;
    restoreBodyPointerEvents: typeof restoreBodyPointerEvents;
};
export {};
