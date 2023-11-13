import { splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useProgressContext } from "./progress-context";
/**
 * The component that visually represents the progress value.
 * Used to visually show the fill of `Progress.Track`.
 */
export function ProgressFill(props) {
    const context = useProgressContext();
    const [local, others] = splitProps(props, ["style"]);
    return (<Polymorphic as="div" style={{
            "--kb-progress-fill-width": context.progressFillWidth(),
            ...local.style,
        }} {...context.dataset()} {...others}/>);
}
