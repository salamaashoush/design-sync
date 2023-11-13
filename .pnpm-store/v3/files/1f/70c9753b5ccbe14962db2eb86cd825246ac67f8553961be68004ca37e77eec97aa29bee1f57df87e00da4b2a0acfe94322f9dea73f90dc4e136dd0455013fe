import { isFunction, mergeDefaultProps } from "@kobalte/utils";
import { children, createEffect, onCleanup, Show, splitProps } from "solid-js";
import { useFormControlContext } from "../form-control";
import { useSelectContext } from "./select-context";
/**
 * The part that reflects the selected value(s).
 */
export function SelectValue(props) {
    const formControlContext = useFormControlContext();
    const context = useSelectContext();
    props = mergeDefaultProps({
        id: context.generateId("value"),
    }, props);
    const [local, others] = splitProps(props, ["id", "children"]);
    const selectionManager = () => context.listState().selectionManager();
    const isSelectionEmpty = () => {
        const selectedKeys = selectionManager().selectedKeys();
        // Some form libraries uses an empty string as default value, often taken from an empty `<option />`.
        // Ignore since it is not a valid key.
        if (selectedKeys.size === 1 && selectedKeys.has("")) {
            return true;
        }
        return selectionManager().isEmpty();
    };
    createEffect(() => onCleanup(context.registerValueId(local.id)));
    return (<span id={local.id} data-placeholder-shown={isSelectionEmpty() ? "" : undefined} {...formControlContext.dataset()} {...others}>
      <Show when={!isSelectionEmpty()} fallback={context.placeholder()}>
        <SelectValueChild state={{
            selectedOption: () => context.selectedOptions()[0],
            selectedOptions: () => context.selectedOptions(),
            remove: option => context.removeOptionFromSelection(option),
            clear: () => selectionManager().clearSelection(),
        }} children={local.children}/>
      </Show>
    </span>);
}
function SelectValueChild(props) {
    const resolvedChildren = children(() => {
        const body = props.children;
        return isFunction(body) ? body(props.state) : body;
    });
    return <>{resolvedChildren()}</>;
}
