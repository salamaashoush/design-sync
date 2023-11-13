import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { createDisclosureState } from "../primitives";
import { Menu } from "./menu";
import { MenuRootContext } from "./menu-root-context";
/**
 * Root component for a menu, provide context for its children.
 * Used to build dropdown menu, context menu and menubar.
 */
export function MenuRoot(props) {
    const defaultId = `menu-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        modal: true,
        preventScroll: false,
    }, props);
    const [local, others] = splitProps(props, [
        "id",
        "modal",
        "preventScroll",
        "forceMount",
        "open",
        "defaultOpen",
        "onOpenChange",
    ]);
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const context = {
        isModal: () => local.modal ?? true,
        preventScroll: () => local.preventScroll ?? false,
        forceMount: () => local.forceMount ?? false,
        generateId: createGenerateId(() => local.id),
    };
    return (<MenuRootContext.Provider value={context}>
      <Menu open={disclosureState.isOpen()} onOpenChange={disclosureState.setIsOpen} {...others}/>
    </MenuRootContext.Provider>);
}
