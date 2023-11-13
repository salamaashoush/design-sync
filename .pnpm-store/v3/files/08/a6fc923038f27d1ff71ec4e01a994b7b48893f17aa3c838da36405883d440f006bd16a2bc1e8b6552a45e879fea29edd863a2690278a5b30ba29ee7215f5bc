import { mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { usePopperContext } from "./popper-context";
/**
 * The wrapper component that positions the popper content relative to the popper anchor.
 */
export function PopperPositioner(props) {
    const context = usePopperContext();
    const [local, others] = splitProps(props, ["ref", "style"]);
    return (<Polymorphic as="div" ref={mergeRefs(context.setPositionerRef, local.ref)} data-popper-positioner="" style={{
            position: "absolute",
            top: 0,
            left: 0,
            "min-width": "max-content",
            ...local.style,
        }} {...others}/>);
}
