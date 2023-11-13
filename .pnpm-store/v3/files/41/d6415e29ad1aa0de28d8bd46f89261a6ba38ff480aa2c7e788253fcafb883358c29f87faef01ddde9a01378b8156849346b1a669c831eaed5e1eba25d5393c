import { Accessor, Setter } from "solid-js";
import { FormControlDataSet } from "../form-control";
import { CollectionItemWithRef } from "../primitives";
import { SliderState } from "./create-slider-state";
import { GetValueLabelParams } from "./slider-root";
export interface SliderDataSet extends FormControlDataSet {
    "data-orientation": "vertical" | "horizontal" | undefined;
}
export type Side = "left" | "top" | "bottom" | "right";
export interface SliderContextValue {
    dataset: Accessor<SliderDataSet>;
    state: SliderState;
    thumbs: Accessor<CollectionItemWithRef[]>;
    setThumbs: Setter<CollectionItemWithRef[]>;
    onSlideStart: ((index: number, value: number) => void) | undefined;
    onSlideMove: ((deltas: {
        deltaX: number;
        deltaY: number;
    }) => void) | undefined;
    onSlideEnd: (() => void) | undefined;
    onStepKeyDown: (event: KeyboardEvent, index: number) => void;
    isSlidingFromLeft: () => boolean;
    isSlidingFromBottom: () => boolean;
    trackRef: Accessor<HTMLElement | undefined>;
    startEdge: Accessor<Side>;
    endEdge: Accessor<Side>;
    minValue: Accessor<number>;
    maxValue: Accessor<number>;
    inverted: Accessor<boolean>;
    registerTrack: (ref: HTMLElement) => void;
    generateId: (part: string) => string;
    getValueLabel: ((params: GetValueLabelParams) => string) | undefined;
}
export declare const SliderContext: import("solid-js").Context<SliderContextValue>;
export declare function useSliderContext(): SliderContextValue;
