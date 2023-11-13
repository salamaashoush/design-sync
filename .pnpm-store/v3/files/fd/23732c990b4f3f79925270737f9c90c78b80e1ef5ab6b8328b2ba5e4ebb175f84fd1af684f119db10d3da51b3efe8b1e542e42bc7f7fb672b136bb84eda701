import { Direction } from "../i18n";
export type BasePlacement = "top" | "bottom" | "left" | "right";
export type Placement = BasePlacement | `${BasePlacement}-start` | `${BasePlacement}-end`;
export type AnchorRect = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
};
export declare function getAnchorElement(anchor: HTMLElement | undefined, getAnchorRect: (anchor?: HTMLElement) => AnchorRect | undefined): {
    contextElement: HTMLElement;
    getBoundingClientRect: () => DOMRect;
};
export declare function isValidPlacement(flip: string): flip is Placement;
export declare function getTransformOrigin(placement: Placement, readingDirection: Direction): string;
