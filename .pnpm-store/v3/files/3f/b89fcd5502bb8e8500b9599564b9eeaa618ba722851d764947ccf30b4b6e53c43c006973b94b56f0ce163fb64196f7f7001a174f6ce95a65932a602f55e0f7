/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-aria/progress/src/useProgressBar.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
interface GetValueLabelParams {
    value: number;
    min: number;
    max: number;
}
export interface ProgressRootOptions extends AsChildProp {
    /**
     * The progress value.
     * @default 0
     */
    value?: number;
    /**
     * The minimum progress value.
     * @default 0
     */
    minValue?: number;
    /**
     * The maximum progress value.
     * @default 100
     */
    maxValue?: number;
    /** Whether the progress is in an indeterminate state. */
    indeterminate?: boolean;
    /**
     * A function to get the accessible label text representing the current value in a human-readable format.
     * If not provided, the value label will be read as a percentage of the max value.
     */
    getValueLabel?: (params: GetValueLabelParams) => string;
}
export interface ProgressRootProps extends OverrideComponentProps<"div", ProgressRootOptions> {
}
/**
 * Progress show either determinate or indeterminate progress of an operation over time.
 */
export declare function ProgressRoot(props: ProgressRootProps): import("solid-js").JSX.Element;
export {};
