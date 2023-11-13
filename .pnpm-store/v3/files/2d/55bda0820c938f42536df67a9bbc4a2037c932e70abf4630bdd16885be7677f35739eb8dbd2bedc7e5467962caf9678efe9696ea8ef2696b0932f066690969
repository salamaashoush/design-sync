import { callHandler, EventKey, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useRadioGroupItemContext } from "./radio-group-item-context";
/**
 * The element that visually represents a radio button.
 */
export function RadioGroupItemControl(props) {
    const context = useRadioGroupItemContext();
    props = mergeDefaultProps({
        id: context.generateId("control"),
    }, props);
    const [local, others] = splitProps(props, ["onClick", "onKeyDown"]);
    const onClick = e => {
        callHandler(e, local.onClick);
        context.select();
        context.inputRef()?.focus();
    };
    const onKeyDown = e => {
        callHandler(e, local.onKeyDown);
        if (e.key === EventKey.Space) {
            context.select();
            context.inputRef()?.focus();
        }
    };
    return (<Polymorphic as="div" onClick={onClick} onKeyDown={onKeyDown} {...context.dataset()} {...others}/>);
}
