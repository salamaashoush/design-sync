import { Polymorphic } from "../polymorphic";
import { useProgressContext } from "./progress-context";
/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function ProgressValueLabel(props) {
    const context = useProgressContext();
    return <Polymorphic as="div" children={context.valueLabel()} {...context.dataset()} {...props}/>;
}
