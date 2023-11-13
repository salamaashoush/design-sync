import { mergeRefs } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { DismissableLayer } from "../dismissable-layer";
import { PopperPositioner } from "../popper";
import { useHoverCardContext } from "./hover-card-context";
/**
 * Contains the content to be rendered when the hovercard is open.
 */
export function HoverCardContent(props) {
    const context = useHoverCardContext();
    const [local, others] = splitProps(props, ["ref", "style"]);
    return (<Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
        }, local.ref)} disableOutsidePointerEvents={false} style={{
            "--kb-hovercard-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
        }} onFocusOutside={e => e.preventDefault()} onDismiss={context.close} {...context.dataset()} {...others}/>
      </PopperPositioner>
    </Show>);
}
