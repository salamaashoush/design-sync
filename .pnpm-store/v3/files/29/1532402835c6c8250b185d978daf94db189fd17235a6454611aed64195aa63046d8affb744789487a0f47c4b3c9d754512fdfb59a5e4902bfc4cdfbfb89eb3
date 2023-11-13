/*!
 * Portions of this file are based on code from radix-ui.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the radix-ui team:
 * https://github.com/radix-ui/primitives/blob/02b036d4181131dfc0224044ba5f17d260bce2f8/packages/react/toggle/src/Toggle.tsx
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-aria/button/src/useToggleButton.ts
 */
import { callHandler, isFunction } from "@kobalte/utils";
import { children, splitProps } from "solid-js";
import * as Button from "../button";
import { createToggleState } from "../primitives";
/**
 * A two-state button that allow users to toggle a selection on or off.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export function ToggleButtonRoot(props) {
    const [local, others] = splitProps(props, [
        "children",
        "pressed",
        "defaultPressed",
        "onChange",
        "onClick",
    ]);
    const state = createToggleState({
        isSelected: () => local.pressed,
        defaultIsSelected: () => local.defaultPressed,
        onSelectedChange: selected => local.onChange?.(selected),
        isDisabled: () => others.disabled,
    });
    const onClick = e => {
        callHandler(e, local.onClick);
        state.toggle();
    };
    return (<Button.Root aria-pressed={state.isSelected()} data-pressed={state.isSelected() ? "" : undefined} onClick={onClick} {...others}>
      <ToggleButtonRootChild state={{ pressed: state.isSelected }} children={local.children}/>
    </Button.Root>);
}
function ToggleButtonRootChild(props) {
    const resolvedChildren = children(() => {
        const body = props.children;
        return isFunction(body) ? body(props.state) : body;
    });
    return <>{resolvedChildren()}</>;
}
