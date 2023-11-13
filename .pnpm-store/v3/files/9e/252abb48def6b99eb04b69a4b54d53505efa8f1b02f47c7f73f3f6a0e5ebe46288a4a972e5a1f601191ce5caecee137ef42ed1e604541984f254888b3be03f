import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useDatePickerContext } from "./date-picker-context";
/**
 * Portals its children into the `body` when the date picker is open.
 */
export function DatePickerPortal(props) {
    const context = useDatePickerContext();
    return (<Show when={context.contentPresence.isPresent()}>
      <Portal {...props}/>
    </Show>);
}
