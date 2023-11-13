/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
import { focusWithoutScrolling, mergeDefaultProps, removeItemFromArray } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, onCleanup, splitProps, } from "solid-js";
import { createListState } from "../list";
import { PopperRoot } from "../popper";
import { createDisclosureState, createHideOutside, createPresence, createRegisterId, } from "../primitives";
import { createDomCollection, useOptionalDomCollectionContext, } from "../primitives/create-dom-collection";
import { MenuContext, useOptionalMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
import { isPointerInGraceArea } from "./utils";
/**
 * Container for menu items and nested menu, provide context for its children.
 */
export function Menu(props) {
    const rootContext = useMenuRootContext();
    const parentDomCollectionContext = useOptionalDomCollectionContext();
    const parentMenuContext = useOptionalMenuContext();
    props = mergeDefaultProps({
        placement: "bottom-start",
    }, props);
    const [local, others] = splitProps(props, ["open", "defaultOpen", "onOpenChange"]);
    let pointerGraceTimeoutId = 0;
    let pointerGraceIntent = null;
    let pointerDir = "right";
    const [triggerId, setTriggerId] = createSignal();
    const [contentId, setContentId] = createSignal();
    const [triggerRef, setTriggerRef] = createSignal();
    const [contentRef, setContentRef] = createSignal();
    const [focusStrategy, setFocusStrategy] = createSignal(true);
    const [currentPlacement, setCurrentPlacement] = createSignal(others.placement);
    const [nestedMenus, setNestedMenus] = createSignal([]);
    const [items, setItems] = createSignal([]);
    const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const contentPresence = createPresence(() => rootContext.forceMount() || disclosureState.isOpen());
    const listState = createListState({
        selectionMode: "none",
        dataSource: items,
    });
    const open = (focusStrategy) => {
        setFocusStrategy(focusStrategy);
        disclosureState.open();
    };
    const close = (recursively = false) => {
        disclosureState.close();
        if (recursively && parentMenuContext) {
            parentMenuContext.close(true);
        }
    };
    const toggle = (focusStrategy) => {
        setFocusStrategy(focusStrategy);
        disclosureState.toggle();
    };
    const focusContent = () => {
        const content = contentRef();
        if (content) {
            focusWithoutScrolling(content);
            listState.selectionManager().setFocused(true);
            listState.selectionManager().setFocusedKey(undefined);
        }
    };
    const registerNestedMenu = (element) => {
        setNestedMenus(prev => [...prev, element]);
        const parentUnregister = parentMenuContext?.registerNestedMenu(element);
        return () => {
            setNestedMenus(prev => removeItemFromArray(prev, element));
            parentUnregister?.();
        };
    };
    const isPointerMovingToSubmenu = (e) => {
        const isMovingTowards = pointerDir === pointerGraceIntent?.side;
        return isMovingTowards && isPointerInGraceArea(e, pointerGraceIntent?.area);
    };
    const onItemEnter = (e) => {
        if (isPointerMovingToSubmenu(e)) {
            e.preventDefault();
        }
    };
    const onItemLeave = (e) => {
        if (isPointerMovingToSubmenu(e)) {
            return;
        }
        focusContent();
    };
    const onTriggerLeave = (e) => {
        if (isPointerMovingToSubmenu(e)) {
            e.preventDefault();
        }
    };
    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    createHideOutside({
        isDisabled: () => {
            // Apply only on root menu when opened and modal.
            return !(parentMenuContext == null && disclosureState.isOpen() && rootContext.isModal());
        },
        targets: () => [contentRef(), ...nestedMenus()].filter(Boolean),
    });
    createEffect(() => {
        const contentEl = contentRef();
        if (!contentEl || !parentMenuContext) {
            return;
        }
        const parentUnregister = parentMenuContext.registerNestedMenu(contentEl);
        onCleanup(() => {
            parentUnregister();
        });
    });
    const dataset = createMemo(() => ({
        "data-expanded": disclosureState.isOpen() ? "" : undefined,
        "data-closed": !disclosureState.isOpen() ? "" : undefined,
    }));
    const context = {
        dataset,
        isOpen: disclosureState.isOpen,
        contentPresence,
        currentPlacement,
        pointerGraceTimeoutId: () => pointerGraceTimeoutId,
        autoFocus: focusStrategy,
        listState: () => listState,
        parentMenuContext: () => parentMenuContext,
        triggerRef,
        contentRef,
        triggerId,
        contentId,
        setTriggerRef,
        setContentRef,
        open,
        close,
        toggle,
        focusContent,
        onItemEnter,
        onItemLeave,
        onTriggerLeave,
        setPointerDir: (dir) => (pointerDir = dir),
        setPointerGraceTimeoutId: (id) => (pointerGraceTimeoutId = id),
        setPointerGraceIntent: (intent) => (pointerGraceIntent = intent),
        registerNestedMenu,
        registerItemToParentDomCollection: parentDomCollectionContext?.registerItem,
        registerTriggerId: createRegisterId(setTriggerId),
        registerContentId: createRegisterId(setContentId),
    };
    return (<DomCollectionProvider>
      <MenuContext.Provider value={context}>
        <PopperRoot anchorRef={triggerRef} contentRef={contentRef} onCurrentPlacementChange={setCurrentPlacement} {...others}/>
      </MenuContext.Provider>
    </DomCollectionProvider>);
}
