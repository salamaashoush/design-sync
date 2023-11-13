import { mergeDefaultProps } from "@kobalte/utils";
import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";
/**
 * The thumb that is used to visually indicate whether the switch is on or off.
 */
export function SwitchThumb(props) {
    const formControlContext = useFormControlContext();
    const context = useSwitchContext();
    props = mergeDefaultProps({
        id: context.generateId("thumb"),
    }, props);
    return (<Polymorphic as="div" {...formControlContext.dataset()} {...context.dataset()} {...props}/>);
}
