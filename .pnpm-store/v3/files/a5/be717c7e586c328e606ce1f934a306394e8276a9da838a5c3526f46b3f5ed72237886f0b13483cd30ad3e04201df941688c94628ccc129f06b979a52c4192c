import { OverrideComponentProps } from "@kobalte/utils";
import * as Listbox from "../listbox";
export interface ComboboxListboxOptions<Option, OptGroup = never> extends Pick<Listbox.ListboxRootOptions<Option, OptGroup>, "scrollRef" | "scrollToItem" | "children"> {
}
export interface ComboboxListboxProps<Option, OptGroup = never> extends Omit<OverrideComponentProps<"ul", ComboboxListboxOptions<Option, OptGroup>>, "onChange"> {
}
/**
 * Contains all the items of a `Combobox`.
 */
export declare function ComboboxListbox<Option = any, OptGroup = never>(props: ComboboxListboxProps<Option, OptGroup>): import("solid-js").JSX.Element;
