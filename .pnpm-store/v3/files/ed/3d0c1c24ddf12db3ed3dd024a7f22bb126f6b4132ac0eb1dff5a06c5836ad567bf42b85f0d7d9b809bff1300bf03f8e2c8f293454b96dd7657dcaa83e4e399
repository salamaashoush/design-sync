import { Polymorphic } from "../polymorphic";
import { useProgressContext } from "./progress-context";
/**
 * The component that visually represents the progress track.
 * Act as a container for `Progress.Fill`.
 */
export function ProgressTrack(props) {
    const context = useProgressContext();
    return <Polymorphic as="div" {...context.dataset()} {...props}/>;
}
