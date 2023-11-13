/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-stately/datepicker/src/useDateFieldState.ts
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/datepicker/src/useDateField.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
import { DateSegment } from "./types";
export interface DatePickerInputOptions extends AsChildProp {
    children?: (segment: Accessor<DateSegment>) => JSX.Element;
}
export interface DatePickerInputProps extends OverrideComponentProps<"div", DatePickerInputOptions> {
}
export declare function DatePickerInput(props: DatePickerInputProps): JSX.Element;
