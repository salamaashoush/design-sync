/* eslint-disable solid/reactivity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/slider/src/Slider.tsx
 */
import { access, clamp, createGenerateId, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createNumberFormatter, useLocale } from "../i18n";
import { Polymorphic } from "../polymorphic";
import { createFormResetListener } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { createSliderState } from "./create-slider-state";
import { SliderContext } from "./slider-context";
import { getNextSortedValues, hasMinStepsBetweenValues } from "./utils";
export function SliderRoot(props) {
    let ref;
    const defaultId = `slider-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        minValue: 0,
        maxValue: 100,
        step: 1,
        minStepsBetweenThumbs: 0,
        orientation: "horizontal",
        disabled: false,
        inverted: false,
        getValueLabel: params => params.values.join(", "),
    }, props);
    const [local, formControlProps, others] = splitProps(props, [
        "ref",
        "value",
        "defaultValue",
        "onChange",
        "onChangeEnd",
        "inverted",
        "minValue",
        "maxValue",
        "step",
        "minStepsBetweenThumbs",
        "getValueLabel",
        "orientation",
    ], FORM_CONTROL_PROP_NAMES);
    const { formControlContext } = createFormControl(formControlProps);
    const defaultFormatter = createNumberFormatter(() => ({ style: "decimal" }));
    const { direction } = useLocale();
    const state = createSliderState({
        value: () => local.value,
        defaultValue: () => local.defaultValue ?? [local.minValue],
        maxValue: () => local.maxValue,
        minValue: () => local.minValue,
        minStepsBetweenThumbs: () => local.minStepsBetweenThumbs,
        isDisabled: () => formControlContext.isDisabled() ?? false,
        orientation: () => local.orientation,
        step: () => local.step,
        numberFormatter: defaultFormatter(),
        onChange: local.onChange,
        onChangeEnd: local.onChangeEnd,
    });
    const [thumbs, setThumbs] = createSignal([]);
    const { DomCollectionProvider } = createDomCollection({
        items: thumbs,
        onItemsChange: setThumbs,
    });
    createFormResetListener(() => ref, () => state.resetValues());
    const isLTR = () => direction() === "ltr";
    const isSlidingFromLeft = () => {
        return (isLTR() && !local.inverted) || (!isLTR() && local.inverted);
    };
    const isSlidingFromBottom = () => !local.inverted;
    const isVertical = () => state.orientation() === "vertical";
    const dataset = createMemo(() => {
        return {
            ...formControlContext.dataset(),
            "data-orientation": local.orientation,
        };
    });
    const [trackRef, setTrackRef] = createSignal();
    let currentPosition = null;
    const onSlideStart = (index, value) => {
        state.setFocusedThumb(index);
        state.setThumbDragging(index, true);
        state.setThumbValue(index, value);
        currentPosition = null;
    };
    const onSlideMove = ({ deltaX, deltaY }) => {
        const active = state.focusedThumb();
        if (active === undefined) {
            return;
        }
        const { width, height } = trackRef().getBoundingClientRect();
        const size = isVertical() ? height : width;
        if (currentPosition === null) {
            currentPosition = state.getThumbPercent(state.focusedThumb()) * size;
        }
        let delta = isVertical() ? deltaY : deltaX;
        if ((!isVertical() && local.inverted) || (isVertical() && isSlidingFromBottom())) {
            delta = -delta;
        }
        currentPosition += delta;
        const percent = clamp(currentPosition / size, 0, 1);
        const nextValues = getNextSortedValues(state.values(), currentPosition, active);
        if (hasMinStepsBetweenValues(nextValues, local.minStepsBetweenThumbs * state.step())) {
            state.setThumbPercent(state.focusedThumb(), percent);
            local.onChange?.(state.values());
        }
    };
    const onSlideEnd = () => {
        const activeThumb = state.focusedThumb();
        if (activeThumb !== undefined) {
            state.setThumbDragging(activeThumb, false);
            local.onChangeEnd?.(state.values());
        }
    };
    const onHomeKeyDown = () => {
        !formControlContext.isDisabled() &&
            state.focusedThumb() !== undefined &&
            state.setThumbValue(0, state.getThumbMinValue(0));
    };
    const onEndKeyDown = () => {
        !formControlContext.isDisabled() &&
            state.focusedThumb() !== undefined &&
            state.setThumbValue(state.values().length - 1, state.getThumbMaxValue(state.values().length - 1));
    };
    const onStepKeyDown = (event, index) => {
        if (!formControlContext.isDisabled()) {
            switch (event.key) {
                case "Left":
                case "ArrowLeft":
                    event.preventDefault();
                    event.stopPropagation();
                    if (!isLTR()) {
                        state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    else {
                        state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    break;
                case "Right":
                case "ArrowRight":
                    event.preventDefault();
                    event.stopPropagation();
                    if (!isLTR()) {
                        state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    else {
                        state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    break;
                case "Up":
                case "ArrowUp":
                    event.preventDefault();
                    event.stopPropagation();
                    if (!isLTR()) {
                        state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    else {
                        state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    break;
                case "Down":
                case "ArrowDown":
                    event.preventDefault();
                    event.stopPropagation();
                    if (!isLTR()) {
                        state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    else {
                        state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
                    }
                    break;
                case "Home":
                    onHomeKeyDown();
                    break;
                case "End":
                    onEndKeyDown();
                    break;
                case "PageUp":
                    state.incrementThumb(index, state.pageSize());
                    break;
                case "PageDown":
                    state.decrementThumb(index, state.pageSize());
                    break;
            }
        }
    };
    const startEdge = createMemo(() => {
        if (isVertical()) {
            return isSlidingFromBottom() ? "bottom" : "top";
        }
        return isSlidingFromLeft() ? "left" : "right";
    });
    const endEdge = createMemo(() => {
        if (isVertical()) {
            return isSlidingFromBottom() ? "top" : "bottom";
        }
        return isSlidingFromLeft() ? "right" : "left";
    });
    const context = {
        dataset,
        state,
        thumbs,
        setThumbs,
        onSlideStart,
        onSlideMove,
        onSlideEnd,
        onStepKeyDown,
        isSlidingFromLeft,
        isSlidingFromBottom,
        trackRef,
        minValue: () => local.minValue,
        maxValue: () => local.maxValue,
        inverted: () => local.inverted,
        startEdge,
        endEdge,
        registerTrack: (ref) => setTrackRef(ref),
        generateId: createGenerateId(() => access(formControlProps.id)),
        getValueLabel: local.getValueLabel,
    };
    return (<DomCollectionProvider>
      <FormControlContext.Provider value={formControlContext}>
        <SliderContext.Provider value={context}>
          <Polymorphic as="div" ref={mergeRefs(el => (ref = el), local.ref)} role="group" id={access(formControlProps.id)} {...dataset()} {...others}/>
        </SliderContext.Provider>
      </FormControlContext.Provider>
    </DomCollectionProvider>);
}
