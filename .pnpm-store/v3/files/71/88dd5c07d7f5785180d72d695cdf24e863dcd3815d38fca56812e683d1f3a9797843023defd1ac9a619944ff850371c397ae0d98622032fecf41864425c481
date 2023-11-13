import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useSelectContext } from "./select-context";
/**
 * Portals its children into the `body` when the select is open.
 */
export function SelectPortal(props) {
    const context = useSelectContext();
    return (<Show when={context.contentPresence.isPresent()}>
      <Portal {...props}/>
    </Show>);
}
