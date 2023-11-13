import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId } from "solid-js";
import { MenuRoot } from "../menu";
/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export function DropdownMenuRoot(props) {
    const defaultId = `dropdownmenu-${createUniqueId()}`;
    props = mergeDefaultProps({ id: defaultId }, props);
    return <MenuRoot {...props}/>;
}
