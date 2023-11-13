/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-stately/slider/src/useSliderState.ts
 */
import { Accessor } from "solid-js";
export interface SliderState {
    readonly values: Accessor<number[]>;
    getThumbValue(index: number): number;
    setThumbValue(index: number, value: number): void;
    getThumbPercent(index: number): number;
    setThumbPercent(index: number, percent: number): void;
    isThumbDragging(index: number): boolean;
    setThumbDragging(index: number, dragging: boolean): void;
    readonly focusedThumb: Accessor<number | undefined>;
    setFocusedThumb(index: number | undefined): void;
    getValuePercent(value: number): number;
    getThumbValueLabel(index: number): string;
    getFormattedValue(value: number): string;
    getThumbMinValue(index: number): number;
    getThumbMaxValue(index: number): number;
    getPercentValue(percent: number): number;
    isThumbEditable(index: number): boolean;
    setThumbEditable(index: number, editable: boolean): void;
    incrementThumb(index: number, stepSize?: number): void;
    decrementThumb(index: number, stepSize?: number): void;
    readonly step: Accessor<number>;
    readonly pageSize: Accessor<number>;
    readonly orientation: Accessor<"horizontal" | "vertical">;
    readonly isDisabled: Accessor<boolean>;
    setValues: (next: number[] | ((prev: number[]) => number[])) => void;
    resetValues: () => void;
}
interface StateOpts {
    value: Accessor<number[] | undefined>;
    defaultValue: Accessor<number[] | undefined>;
    orientation?: Accessor<"horizontal" | "vertical">;
    isDisabled?: Accessor<boolean>;
    onChangeEnd?: (value: number[]) => void;
    onChange?: (value: number[]) => void;
    minValue?: Accessor<number>;
    maxValue?: Accessor<number>;
    step?: Accessor<number>;
    numberFormatter: Intl.NumberFormat;
    minStepsBetweenThumbs?: Accessor<number>;
}
export declare function createSliderState(props: StateOpts): SliderState;
export {};
