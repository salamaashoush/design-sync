/* @refresh reload */
/* eslint-disable solid/reactivity */
/* eslint-disable solid/components-return-once */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/b14ac1fff0cdaf45d1ea3e65c28c320ac0f743f2/packages/react/slot/src/Slot.tsx
 */
import { combineProps as baseCombineProps, isArray } from "@kobalte/utils";
import { children, For, Show, splitProps, } from "solid-js";
import { Dynamic } from "solid-js/web";
/**
 * A utility component that render either a direct `<As>` child or its `as` prop.
 */
export function Polymorphic(props) {
    const [local, others] = splitProps(props, [
        "asChild",
        "as",
        "children",
    ]);
    // Prevent the extra computation below when "as child" polymorphism is not needed.
    if (!local.asChild) {
        return (<Dynamic component={local.as} {...others}>
        {local.children}
      </Dynamic>);
    }
    const resolvedChildren = children(() => local.children);
    // Single child is `As`.
    if (isAs(resolvedChildren())) {
        const combinedProps = combineProps(others, resolvedChildren()?.props ?? {});
        return <Dynamic {...combinedProps}/>;
    }
    // Multiple children, find an `As` if any.
    if (isArray(resolvedChildren())) {
        const newElement = resolvedChildren().find(isAs);
        if (newElement) {
            // because the new element will be the one rendered, we are only interested
            // in grabbing its children (`newElement.props.children`)
            const newChildren = () => (<For each={resolvedChildren()}>
          {(child) => (<Show when={child === newElement} fallback={child}>
              {newElement.props.children}
            </Show>)}
        </For>);
            const combinedProps = combineProps(others, newElement?.props ?? {});
            return <Dynamic {...combinedProps}>{newChildren}</Dynamic>;
        }
    }
    throw new Error("[kobalte]: Component is expected to render `asChild` but no children `As` component was found.");
}
/* -------------------------------------------------------------------------------------------------
 * As
 * -----------------------------------------------------------------------------------------------*/
const AS_COMPONENT_SYMBOL = Symbol("$$KobalteAsComponent");
/**
 * A utility component used to delegate rendering of its `Polymorphic` parent component.
 */
export function As(props) {
    return {
        [AS_COMPONENT_SYMBOL]: true,
        props,
    };
}
/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/
function isAs(component) {
    return component?.[AS_COMPONENT_SYMBOL] === true;
}
function combineProps(baseProps, overrideProps) {
    return baseCombineProps([baseProps, overrideProps], { reverseEventHandlers: true });
}
