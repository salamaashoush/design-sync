/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */
import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, splitProps } from "solid-js";
import * as Collapsible from "../collapsible";
import { createRegisterId } from "../primitives";
import { useAccordionContext } from "./accordion-context";
import { AccordionItemContext } from "./accordion-item-context";
/**
 * An item of the accordion, contains all the parts of a collapsible section.
 */
export function AccordionItem(props) {
    const accordionContext = useAccordionContext();
    const defaultId = `${accordionContext.generateId("item")}-${createUniqueId()}`;
    props = mergeDefaultProps({ id: defaultId }, props);
    const [local, others] = splitProps(props, ["value", "disabled"]);
    const [triggerId, setTriggerId] = createSignal();
    const [contentId, setContentId] = createSignal();
    const selectionManager = () => accordionContext.listState().selectionManager();
    const isExpanded = () => {
        return selectionManager().isSelected(local.value);
    };
    const context = {
        value: () => local.value,
        triggerId,
        contentId,
        generateId: createGenerateId(() => others.id),
        registerTriggerId: createRegisterId(setTriggerId),
        registerContentId: createRegisterId(setContentId),
    };
    return (<AccordionItemContext.Provider value={context}>
      <Collapsible.Root open={isExpanded()} disabled={local.disabled} {...others}/>
    </AccordionItemContext.Provider>);
}
