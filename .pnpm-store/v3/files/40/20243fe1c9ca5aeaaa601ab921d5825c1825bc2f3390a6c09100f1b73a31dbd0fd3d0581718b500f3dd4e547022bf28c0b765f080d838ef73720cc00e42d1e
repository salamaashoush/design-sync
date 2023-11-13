/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/popover/popover-state.ts
 */
import { arrow, autoUpdate, computePosition, flip, hide, offset, platform, shift, size, } from "@floating-ui/dom";
import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { useLocale } from "../i18n";
import { PopperContext } from "./popper-context";
import { getAnchorElement, getTransformOrigin, isValidPlacement, } from "./utils";
/**
 * Display a floating content relative to an anchor element with an optional arrow.
 */
export function PopperRoot(props) {
    props = mergeDefaultProps({
        getAnchorRect: anchor => anchor?.getBoundingClientRect(),
        placement: "bottom",
        gutter: 0,
        shift: 0,
        flip: true,
        slide: true,
        overlap: false,
        sameWidth: false,
        fitViewport: false,
        hideWhenDetached: false,
        detachedPadding: 0,
        arrowPadding: 4,
        overflowPadding: 8,
    }, props);
    const [positionerRef, setPositionerRef] = createSignal();
    const [arrowRef, setArrowRef] = createSignal();
    const [currentPlacement, setCurrentPlacement] = createSignal(props.placement);
    // Floating UI - reference element.
    const anchorRef = () => getAnchorElement(props.anchorRef(), props.getAnchorRect);
    const { direction } = useLocale();
    async function updatePosition() {
        const referenceEl = anchorRef();
        const floatingEl = positionerRef();
        const arrowEl = arrowRef();
        if (!referenceEl || !floatingEl) {
            return;
        }
        const arrowOffset = (arrowEl?.clientHeight || 0) / 2;
        const finalGutter = typeof props.gutter === "number" ? props.gutter + arrowOffset : props.gutter ?? arrowOffset;
        floatingEl.style.setProperty("--kb-popper-content-overflow-padding", `${props.overflowPadding}px`);
        // Virtual element doesn't work without this ¯\_(ツ)_/¯
        referenceEl.getBoundingClientRect();
        const middleware = [
            // https://floating-ui.com/docs/offset
            offset(({ placement }) => {
                // If there's no placement alignment (*-start or *-end), we'll
                // fall back to the crossAxis offset as it also works for
                // center-aligned placements.
                const hasAlignment = !!placement.split("-")[1];
                return {
                    mainAxis: finalGutter,
                    crossAxis: !hasAlignment ? props.shift : undefined,
                    alignmentAxis: props.shift,
                };
            }),
        ];
        if (props.flip !== false) {
            const fallbackPlacements = typeof props.flip === "string" ? props.flip.split(" ") : undefined;
            if (fallbackPlacements !== undefined && !fallbackPlacements.every(isValidPlacement)) {
                throw new Error("`flip` expects a spaced-delimited list of placements");
            }
            // https://floating-ui.com/docs/flip
            middleware.push(flip({
                padding: props.overflowPadding,
                fallbackPlacements: fallbackPlacements,
            }));
        }
        if (props.slide || props.overlap) {
            // https://floating-ui.com/docs/shift
            middleware.push(shift({
                mainAxis: props.slide,
                crossAxis: props.overlap,
                padding: props.overflowPadding,
            }));
        }
        // https://floating-ui.com/docs/size
        middleware.push(size({
            padding: props.overflowPadding,
            apply({ availableWidth, availableHeight, rects }) {
                const referenceWidth = Math.round(rects.reference.width);
                availableWidth = Math.floor(availableWidth);
                availableHeight = Math.floor(availableHeight);
                floatingEl.style.setProperty("--kb-popper-anchor-width", `${referenceWidth}px`);
                floatingEl.style.setProperty("--kb-popper-content-available-width", `${availableWidth}px`);
                floatingEl.style.setProperty("--kb-popper-content-available-height", `${availableHeight}px`);
                if (props.sameWidth) {
                    floatingEl.style.width = `${referenceWidth}px`;
                }
                if (props.fitViewport) {
                    floatingEl.style.maxWidth = `${availableWidth}px`;
                    floatingEl.style.maxHeight = `${availableHeight}px`;
                }
            },
        }));
        // https://floating-ui.com/docs/hide
        if (props.hideWhenDetached) {
            middleware.push(hide({ padding: props.detachedPadding }));
        }
        // https://floating-ui.com/docs/arrow
        if (arrowEl) {
            middleware.push(arrow({ element: arrowEl, padding: props.arrowPadding }));
        }
        // https://floating-ui.com/docs/computePosition
        const pos = await computePosition(referenceEl, floatingEl, {
            placement: props.placement,
            strategy: "absolute",
            middleware,
            platform: {
                ...platform,
                isRTL: () => direction() === "rtl",
            },
        });
        // Sync the new updated placement of floating-ui with our current placement and notify parent.
        setCurrentPlacement(pos.placement);
        props.onCurrentPlacementChange?.(pos.placement);
        if (!floatingEl) {
            return;
        }
        floatingEl.style.setProperty("--kb-popper-content-transform-origin", getTransformOrigin(pos.placement, direction()));
        const x = Math.round(pos.x);
        const y = Math.round(pos.y);
        let visibility;
        if (props.hideWhenDetached) {
            visibility = pos.middlewareData.hide?.referenceHidden ? "hidden" : "visible";
        }
        // https://floating-ui.com/docs/misc#subpixel-and-accelerated-positioning
        Object.assign(floatingEl.style, {
            top: "0",
            left: "0",
            transform: `translate3d(${x}px, ${y}px, 0)`,
            visibility,
        });
        // https://floating-ui.com/docs/arrow#usage
        if (arrowEl && pos.middlewareData.arrow) {
            const { x: arrowX, y: arrowY } = pos.middlewareData.arrow;
            const dir = pos.placement.split("-")[0];
            Object.assign(arrowEl.style, {
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
                [dir]: "100%",
            });
        }
    }
    createEffect(() => {
        const referenceEl = anchorRef();
        const floatingEl = positionerRef();
        if (!referenceEl || !floatingEl) {
            return;
        }
        // https://floating-ui.com/docs/autoUpdate
        const cleanupAutoUpdate = autoUpdate(referenceEl, floatingEl, updatePosition, {
            // JSDOM doesn't support ResizeObserver
            elementResize: typeof ResizeObserver === "function",
        });
        onCleanup(cleanupAutoUpdate);
    });
    // Makes sure the positioner element has the same z-index as the popper content element,
    // so users only need to set the z-index once.
    createEffect(() => {
        const positioner = positionerRef();
        const content = props.contentRef();
        if (!positioner || !content) {
            return;
        }
        queueMicrotask(() => {
            positioner.style.zIndex = getComputedStyle(content).zIndex;
        });
    });
    const context = {
        currentPlacement,
        contentRef: () => props.contentRef(),
        setPositionerRef,
        setArrowRef,
    };
    return <PopperContext.Provider value={context}>{props.children}</PopperContext.Provider>;
}
