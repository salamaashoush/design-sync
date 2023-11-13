import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useTooltipContext } from "./tooltip-context";
/**
 * Portals its children into the `body` when the tooltip is open.
 */
export function TooltipPortal(props) {
    const context = useTooltipContext();
    return (<Show when={context.contentPresence.isPresent()}>
      <Portal {...props}/>
    </Show>);
}
