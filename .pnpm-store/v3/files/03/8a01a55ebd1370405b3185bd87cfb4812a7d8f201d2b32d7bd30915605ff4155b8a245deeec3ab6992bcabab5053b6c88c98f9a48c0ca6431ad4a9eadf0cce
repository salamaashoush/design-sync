/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/1b05a8e35cf35f3020484979086d70aefbaf4095/packages/react/tooltip/src/Tooltip.tsx
 */
import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";
import { DismissableLayer } from "../dismissable-layer";
import { PopperPositioner } from "../popper";
import { useTooltipContext } from "./tooltip-context";
/**
 * Contains the content to be rendered when the tooltip is open.
 */
export function TooltipContent(props) {
    const context = useTooltipContext();
    props = mergeDefaultProps({
        id: context.generateId("content"),
    }, props);
    const [local, others] = splitProps(props, ["ref", "style"]);
    createEffect(() => onCleanup(context.registerContentId(others.id)));
    return (<Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
        }, local.ref)} role="tooltip" disableOutsidePointerEvents={false} style={{
            "--kb-tooltip-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
        }} onFocusOutside={e => e.preventDefault()} onDismiss={() => context.hideTooltip(true)} {...context.dataset()} {...others}/>
      </PopperPositioner>
    </Show>);
}
