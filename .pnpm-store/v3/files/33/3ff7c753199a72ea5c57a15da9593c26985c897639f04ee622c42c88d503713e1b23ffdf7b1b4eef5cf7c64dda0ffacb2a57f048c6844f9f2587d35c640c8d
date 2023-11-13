/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */
import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { createDisclosureState, createRegisterId } from "../primitives";
import { CollapsibleContext, } from "./collapsible-context";
/**
 * An interactive component which expands/collapses a content.
 */
export function CollapsibleRoot(props) {
    const defaultId = `collapsible-${createUniqueId()}`;
    props = mergeDefaultProps({ id: defaultId }, props);
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
        "forceMount",
    ]);
    const [contentId, setContentId] = createSignal();
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const dataset = createMemo(() => ({
        "data-expanded": disclosureState.isOpen() ? "" : undefined,
        "data-closed": !disclosureState.isOpen() ? "" : undefined,
        "data-disabled": local.disabled ? "" : undefined,
    }));
    const context = {
        dataset,
        isOpen: disclosureState.isOpen,
        disabled: () => local.disabled ?? false,
        shouldMount: () => local.forceMount || disclosureState.isOpen(),
        contentId,
        toggle: disclosureState.toggle,
        generateId: createGenerateId(() => others.id),
        registerContentId: createRegisterId(setContentId),
    };
    return (<CollapsibleContext.Provider value={context}>
      <Polymorphic as="div" {...dataset()} {...others}/>
    </CollapsibleContext.Provider>);
}
