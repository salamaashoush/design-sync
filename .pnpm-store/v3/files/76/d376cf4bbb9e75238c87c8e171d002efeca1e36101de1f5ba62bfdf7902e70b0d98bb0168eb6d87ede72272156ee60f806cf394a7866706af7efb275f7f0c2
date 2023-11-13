import { focusWithoutScrolling } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { MenuContent } from "../menu";
import { useMenuContext } from "../menu/menu-context";
import { useMenuRootContext } from "../menu/menu-root-context";
/**
 * Contains the content to be rendered when the dropdown menu is open.
 */
export function DropdownMenuContent(props) {
    const rootContext = useMenuRootContext();
    const context = useMenuContext();
    const [local, others] = splitProps(props, ["onCloseAutoFocus", "onInteractOutside"]);
    let hasInteractedOutside = false;
    const onCloseAutoFocus = (e) => {
        local.onCloseAutoFocus?.(e);
        if (!hasInteractedOutside) {
            focusWithoutScrolling(context.triggerRef());
        }
        hasInteractedOutside = false;
        // Always prevent autofocus because we either focus manually or want user agent focus
        e.preventDefault();
    };
    const onInteractOutside = (e) => {
        local.onInteractOutside?.(e);
        if (!rootContext.isModal() || e.detail.isContextMenu) {
            hasInteractedOutside = true;
        }
    };
    return (<MenuContent onCloseAutoFocus={onCloseAutoFocus} onInteractOutside={onInteractOutside} {...others}/>);
}
