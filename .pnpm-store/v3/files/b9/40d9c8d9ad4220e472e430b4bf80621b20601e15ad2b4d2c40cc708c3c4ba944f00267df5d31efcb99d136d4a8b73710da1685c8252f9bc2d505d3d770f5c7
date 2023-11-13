/*!
 * Portions of this file are based on code from Mantine.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantine team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-core/src/components/Skeleton/Skeleton.tsx
 */
import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
export function Skeleton(props) {
    const defaultId = `skeleton-${createUniqueId()}`;
    props = mergeDefaultProps({
        visible: true,
        animate: true,
        id: defaultId,
    }, props);
    const [local, others] = splitProps(props, [
        "style",
        "ref",
        "radius",
        "animate",
        "height",
        "width",
        "visible",
        "circle",
    ]);
    return (<Polymorphic as="div" role="group" data-animate={local.animate} data-visible={local.visible} style={{
            "border-radius": local.circle ? "9999px" : local.radius ? `${local.radius}px` : undefined,
            width: local.circle ? `${local.height}px` : local.width ? `${local.width}px` : "100%",
            height: local.height ? `${local.height}px` : "auto",
            ...local.style,
        }} {...others}></Polymorphic>);
}
