import { isFunction, mergeRefs } from "@kobalte/utils";
import { children, splitProps } from "solid-js";
import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";
/**
 * Contains the combobox input and trigger.
 */
export function ComboboxControl(props) {
    const formControlContext = useFormControlContext();
    const context = useComboboxContext();
    const [local, others] = splitProps(props, ["ref", "children"]);
    const selectionManager = () => context.listState().selectionManager();
    return (<Polymorphic as="div" ref={mergeRefs(context.setControlRef, local.ref)} {...context.dataset()} {...formControlContext.dataset()} {...others}>
      <ComboboxControlChild state={{
            selectedOptions: () => context.selectedOptions(),
            remove: option => context.removeOptionFromSelection(option),
            clear: () => selectionManager().clearSelection(),
        }} children={local.children}/>
    </Polymorphic>);
}
function ComboboxControlChild(props) {
    const resolvedChildren = children(() => {
        const body = props.children;
        return isFunction(body) ? body(props.state) : body;
    });
    return <>{resolvedChildren()}</>;
}
