/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */
import { composeEventHandlers, createGenerateId, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createSignal, createUniqueId, splitProps } from "solid-js";
import { createListState, createSelectableList } from "../list";
import { Polymorphic } from "../polymorphic";
import { createDomCollection } from "../primitives/create-dom-collection";
import { AccordionContext } from "./accordion-context";
/**
 * A vertically stacked set of interactive headings that each reveal an associated section of content.
 */
export function AccordionRoot(props) {
    let ref;
    const defaultId = `accordion-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        multiple: false,
        collapsible: false,
        shouldFocusWrap: true,
    }, props);
    const [local, others] = splitProps(props, [
        "ref",
        "value",
        "defaultValue",
        "onChange",
        "multiple",
        "collapsible",
        "shouldFocusWrap",
        "onKeyDown",
        "onMouseDown",
        "onFocusIn",
        "onFocusOut",
    ]);
    const [items, setItems] = createSignal([]);
    const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });
    const listState = createListState({
        selectedKeys: () => local.value,
        defaultSelectedKeys: () => local.defaultValue,
        onSelectionChange: value => local.onChange?.(Array.from(value)),
        disallowEmptySelection: () => !local.multiple && !local.collapsible,
        selectionMode: () => (local.multiple ? "multiple" : "single"),
        dataSource: items,
    });
    const selectableList = createSelectableList({
        selectionManager: () => listState.selectionManager(),
        collection: () => listState.collection(),
        disallowEmptySelection: () => listState.selectionManager().disallowEmptySelection(),
        shouldFocusWrap: () => local.shouldFocusWrap,
        disallowTypeAhead: true,
        allowsTabNavigation: true,
    }, () => ref);
    const context = {
        listState: () => listState,
        generateId: createGenerateId(() => others.id),
    };
    return (<DomCollectionProvider>
      <AccordionContext.Provider value={context}>
        <Polymorphic as="div" ref={mergeRefs(el => (ref = el), local.ref)} onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.onKeyDown])} onMouseDown={composeEventHandlers([local.onMouseDown, selectableList.onMouseDown])} onFocusIn={composeEventHandlers([local.onFocusIn, selectableList.onFocusIn])} onFocusOut={composeEventHandlers([local.onFocusOut, selectableList.onFocusOut])} {...others}/>
      </AccordionContext.Provider>
    </DomCollectionProvider>);
}
