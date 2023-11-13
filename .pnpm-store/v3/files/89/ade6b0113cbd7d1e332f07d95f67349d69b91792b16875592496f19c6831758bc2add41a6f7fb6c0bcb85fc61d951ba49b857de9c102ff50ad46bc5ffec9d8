/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e6808d1b5e80cef7af7e63974f658043593b2e1e/packages/@react-aria/menu/src/useMenuSection.ts
 */
import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { MenuGroupContext } from "./menu-group-context";
import { useMenuRootContext } from "./menu-root-context";
/**
 * A container used to group multiple `Menu.Item`s.
 */
export function MenuGroup(props) {
    const rootContext = useMenuRootContext();
    props = mergeDefaultProps({
        id: rootContext.generateId(`group-${createUniqueId()}`),
    }, props);
    const [labelId, setLabelId] = createSignal();
    const context = {
        generateId: createGenerateId(() => props.id),
        registerLabelId: createRegisterId(setLabelId),
    };
    return (<MenuGroupContext.Provider value={context}>
      <Polymorphic as="div" role="group" aria-labelledby={labelId()} {...props}/>
    </MenuGroupContext.Provider>);
}
