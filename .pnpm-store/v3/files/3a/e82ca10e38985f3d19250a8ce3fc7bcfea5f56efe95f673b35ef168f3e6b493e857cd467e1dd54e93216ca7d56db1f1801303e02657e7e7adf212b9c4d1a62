import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import * as Listbox from "../listbox";
export interface SelectListboxOptions<Option, OptGroup = never> extends Pick<Listbox.ListboxRootOptions<Option, OptGroup>, "scrollRef" | "scrollToItem" | "children"> {
}
export interface SelectListboxProps<Option, OptGroup = never> extends Omit<OverrideComponentProps<"ul", SelectListboxOptions<Option, OptGroup>>, "onChange"> {
}
/**
 * Contains all the items of a `Select`.
 */
export declare function SelectListbox<Option = any, OptGroup = never>(props: SelectListboxProps<Option, OptGroup>): JSX.Element;
