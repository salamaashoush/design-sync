import { callHandler } from "@kobalte/utils";
import { splitProps } from "solid-js";
import * as Button from "../button";
import { COMMON_INTL_MESSAGES, createMessageFormatter } from "../i18n";
import { usePopoverContext } from "./popover-context";
/**
 * The button that closes the popover.
 */
export function PopoverCloseButton(props) {
    const context = usePopoverContext();
    const [local, others] = splitProps(props, ["aria-label", "onClick"]);
    const messageFormatter = createMessageFormatter(() => COMMON_INTL_MESSAGES);
    const onClick = e => {
        callHandler(e, local.onClick);
        context.close();
    };
    return (<Button.Root aria-label={local["aria-label"] || messageFormatter().format("dismiss")} onClick={onClick} {...context.dataset()} {...others}/>);
}
