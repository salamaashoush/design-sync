import { access, EventKey, getDocument } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
/**
 * Listens for when the escape key is down on the document.
 */
export function createEscapeKeyDown(props) {
    const handleKeyDown = (event) => {
        if (event.key === EventKey.Escape) {
            props.onEscapeKeyDown?.(event);
        }
    };
    createEffect(() => {
        if (isServer) {
            return;
        }
        if (access(props.isDisabled)) {
            return;
        }
        const document = props.ownerDocument?.() ?? getDocument();
        document.addEventListener("keydown", handleKeyDown);
        onCleanup(() => {
            document.removeEventListener("keydown", handleKeyDown);
        });
    });
}
