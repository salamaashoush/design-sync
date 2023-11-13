/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/slider/src/Slider.tsx
 */
import { OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
export interface GetValueLabelParams {
    values: number[];
    min: number;
    max: number;
}
export interface SliderRootOptions extends AsChildProp {
    /** The slider values. */
    value?: number[];
    /** The value of the slider when initially rendered. */
    defaultValue?: number[];
    /** Called when the value changes. */
    onChange?: (value: number[]) => void;
    /** Called when the value changes at the end of an interaction. */
    onChangeEnd?: (value: number[]) => void;
    /**
     * Whether the slider is visually inverted.
     * @default false
     */
    inverted?: boolean;
    /**
     * The minimum slider value.
     * @default 0
     */
    minValue?: number;
    /**
     * The maximum slider value.
     * @default 100
     */
    maxValue?: number;
    /**
     * The step amount.
     * @default 1
     */
    step?: number;
    /**
     * The minimum permitted steps between multiple thumbs.
     * @default 0
     */
    minStepsBetweenThumbs?: number;
    /**
     * A function to get the accessible label text representing the current value in a human-readable format.
     * If not provided, the value label will be read as a percentage of the max value.
     */
    getValueLabel?: (params: GetValueLabelParams) => string;
    /**
     * The orientation of the slider.
     * @default horizontal
     */
    orientation?: "horizontal" | "vertical";
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * The name of the slider, used when submitting an HTML form.
     * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
     */
    name?: string;
    /** Whether the slider should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must fill the slider before the owning form can be submitted. */
    required?: boolean;
    /** Whether the slider is disabled. */
    disabled?: boolean;
    /** Whether the slider is read only. */
    readOnly?: boolean;
}
export interface SliderRootProps extends OverrideComponentProps<"div", SliderRootOptions> {
}
export declare function SliderRoot(props: SliderRootProps): import("solid-js").JSX.Element;
