import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useComboboxContext } from "./combobox-context";
/**
 * Portals its children into the `body` when the combobox is open.
 */
export function ComboboxPortal(props) {
    const context = useComboboxContext();
    return (<Show when={context.contentPresence.isPresent()}>
      <Portal {...props}/>
    </Show>);
}
