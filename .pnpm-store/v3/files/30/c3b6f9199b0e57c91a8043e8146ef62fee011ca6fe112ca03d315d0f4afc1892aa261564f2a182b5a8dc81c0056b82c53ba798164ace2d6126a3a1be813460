/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
import { callHandler, composeEventHandlers, contains, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createEffect, createUniqueId, onCleanup, Show, splitProps } from "solid-js";
import { DismissableLayer } from "../dismissable-layer";
import { createSelectableList } from "../list";
import { PopperPositioner } from "../popper";
import { createFocusScope, } from "../primitives";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
export function MenuContentBase(props) {
    let ref;
    const rootContext = useMenuRootContext();
    const context = useMenuContext();
    props = mergeDefaultProps({
        id: rootContext.generateId(`content-${createUniqueId()}`),
    }, props);
    const [local, others] = splitProps(props, [
        "ref",
        "id",
        "style",
        "onOpenAutoFocus",
        "onCloseAutoFocus",
        "onEscapeKeyDown",
        "onFocusOutside",
        "onPointerEnter",
        "onPointerMove",
        "onKeyDown",
        "onMouseDown",
        "onFocusIn",
        "onFocusOut",
    ]);
    let lastPointerX = 0;
    // Only the root menu can apply "modal" behavior (block pointer-events and trap focus).
    const isRootModalContent = () => {
        return context.parentMenuContext() == null && rootContext.isModal();
    };
    const selectableList = createSelectableList({
        selectionManager: context.listState().selectionManager,
        collection: context.listState().collection,
        autoFocus: context.autoFocus,
        deferAutoFocus: true,
        shouldFocusWrap: true,
        disallowTypeAhead: () => !context.listState().selectionManager().isFocused(),
    }, () => ref);
    createFocusScope({
        trapFocus: () => isRootModalContent() && context.isOpen(),
        onMountAutoFocus: local.onOpenAutoFocus,
        onUnmountAutoFocus: local.onCloseAutoFocus,
    }, () => ref);
    const onKeyDown = e => {
        // Submenu key events bubble through portals. We only care about keys in this menu.
        if (!contains(e.currentTarget, e.target)) {
            return;
        }
        // Menus should not be navigated using tab key, so we prevent it.
        if (e.key === "Tab" && context.isOpen()) {
            e.preventDefault();
        }
    };
    const onEscapeKeyDown = (e) => {
        local.onEscapeKeyDown?.(e);
        // `createSelectableList` prevent escape key down,
        // which prevent our `onDismiss` in `DismissableLayer` to run,
        // so we force "close on escape" here.
        context.close(true);
    };
    const onFocusOutside = (e) => {
        local.onFocusOutside?.(e);
        if (rootContext.isModal()) {
            // When focus is trapped, a `focusout` event may still happen.
            // We make sure we don't trigger our `onDismiss` in such case.
            e.preventDefault();
        }
    };
    const onPointerEnter = e => {
        callHandler(e, local.onPointerEnter);
        if (!context.isOpen()) {
            return;
        }
        // Remove visual focus from parent menu content.
        context.parentMenuContext()?.listState().selectionManager().setFocused(false);
        context.parentMenuContext()?.listState().selectionManager().setFocusedKey(undefined);
    };
    const onPointerMove = e => {
        callHandler(e, local.onPointerMove);
        if (e.pointerType !== "mouse") {
            return;
        }
        const target = e.target;
        const pointerXHasChanged = lastPointerX !== e.clientX;
        // We don't use `event.movementX` for this check because Safari will
        // always return `0` on a pointer event.
        if (contains(e.currentTarget, target) && pointerXHasChanged) {
            context.setPointerDir(e.clientX > lastPointerX ? "right" : "left");
            lastPointerX = e.clientX;
        }
    };
    createEffect(() => onCleanup(context.registerContentId(local.id)));
    return (<Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
            ref = el;
        }, local.ref)} role="menu" id={local.id} tabIndex={selectableList.tabIndex()} disableOutsidePointerEvents={isRootModalContent() && context.isOpen()} excludedElements={[context.triggerRef]} bypassTopMostLayerCheck style={{
            "--kb-menu-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
        }} aria-labelledby={context.triggerId()} onEscapeKeyDown={onEscapeKeyDown} onFocusOutside={onFocusOutside} onDismiss={context.close} onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.onKeyDown, onKeyDown])} onMouseDown={composeEventHandlers([local.onMouseDown, selectableList.onMouseDown])} onFocusIn={composeEventHandlers([local.onFocusIn, selectableList.onFocusIn])} onFocusOut={composeEventHandlers([local.onFocusOut, selectableList.onFocusOut])} onPointerEnter={onPointerEnter} onPointerMove={onPointerMove} {...context.dataset()} {...others}/>
      </PopperPositioner>
    </Show>);
}
