/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/select/src/HiddenSelect.tsx
 */
import { ComponentProps } from "solid-js";
import { Collection, CollectionNode } from "../primitives";
import { SelectionManager } from "../selection";
export interface HiddenSelectBaseProps extends ComponentProps<"select"> {
    collection: Collection<CollectionNode>;
    selectionManager: SelectionManager;
    isOpen: boolean;
    isMultiple: boolean;
    isVirtualized: boolean;
    focusTrigger: () => void;
}
/**
 * Renders a hidden native `<select>` element, which can be used to support browser
 * form autofill, mobile form navigation, and native form submission.
 */
export declare function HiddenSelectBase(props: HiddenSelectBaseProps): import("solid-js").JSX.Element;
