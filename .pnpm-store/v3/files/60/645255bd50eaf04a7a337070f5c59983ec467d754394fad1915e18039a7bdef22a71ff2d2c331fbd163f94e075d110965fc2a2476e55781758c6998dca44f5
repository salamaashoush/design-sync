import { callHandler } from "@kobalte/utils";
import { splitProps } from "solid-js";
import * as Button from "../button";
import { COMMON_INTL_MESSAGES, createMessageFormatter } from "../i18n";
import { useDialogContext } from "./dialog-context";
/**
 * The button that closes the dialog.
 */
export function DialogCloseButton(props) {
    const context = useDialogContext();
    const [local, others] = splitProps(props, ["aria-label", "onClick"]);
    const messageFormatter = createMessageFormatter(() => COMMON_INTL_MESSAGES);
    const onClick = e => {
        callHandler(e, local.onClick);
        context.close();
    };
    return (<Button.Root aria-label={local["aria-label"] || messageFormatter().format("dismiss")} onClick={onClick} {...others}/>);
}
