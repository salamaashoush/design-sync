/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
import { Polygon } from "@kobalte/utils";
import { Placement } from "../popper/utils";
export type Side = "left" | "right";
export type GraceIntent = {
    area: Polygon;
    side: Side;
};
/**
 * Construct a polygon based on pointer clientX/clientY and an element bounding rect.
 */
export declare function getPointerGraceArea(placement: Placement, event: PointerEvent, contentEl: Element): Polygon;
export declare function isPointerInGraceArea(event: PointerEvent, area?: Polygon): boolean;
