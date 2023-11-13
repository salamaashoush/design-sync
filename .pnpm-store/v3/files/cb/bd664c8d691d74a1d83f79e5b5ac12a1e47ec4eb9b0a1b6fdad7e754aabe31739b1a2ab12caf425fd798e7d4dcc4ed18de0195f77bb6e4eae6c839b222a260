import { mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { createPreventScroll } from "../primitives";
import { MenuContentBase } from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
export function MenuContent(props) {
    let ref;
    const rootContext = useMenuRootContext();
    const context = useMenuContext();
    const [local, others] = splitProps(props, ["ref"]);
    createPreventScroll({
        ownerRef: () => ref,
        isDisabled: () => !(context.isOpen() && (rootContext.isModal() || rootContext.preventScroll())),
    });
    return <MenuContentBase ref={mergeRefs(el => (ref = el), local.ref)} {...others}/>;
}
