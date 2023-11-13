/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/avatar/src/Avatar.tsx
 */
import { createSignal, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { ImageContext } from "./image-context";
/**
 * An image element with an optional fallback for loading and error status.
 */
export function ImageRoot(props) {
    const [local, others] = splitProps(props, ["fallbackDelay", "onLoadingStatusChange"]);
    const [imageLoadingStatus, setImageLoadingStatus] = createSignal("idle");
    const context = {
        fallbackDelay: () => local.fallbackDelay,
        imageLoadingStatus,
        onImageLoadingStatusChange: status => {
            setImageLoadingStatus(status);
            local.onLoadingStatusChange?.(status);
        },
    };
    return (<ImageContext.Provider value={context}>
      <Polymorphic as="span" {...others}/>
    </ImageContext.Provider>);
}
