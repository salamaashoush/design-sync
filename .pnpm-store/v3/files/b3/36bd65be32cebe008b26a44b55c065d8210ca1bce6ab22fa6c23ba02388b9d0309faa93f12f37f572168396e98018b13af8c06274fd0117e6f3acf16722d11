/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-stately/slider/src/useSliderState.ts
 */
import { clamp, mergeDefaultProps, snapValueToStep } from "@kobalte/utils";
import { createMemo, createSignal } from "solid-js";
import { createControllableArraySignal } from "../primitives";
import { getNextSortedValues, hasMinStepsBetweenValues } from "./utils";
export function createSliderState(props) {
    props = mergeDefaultProps({
        minValue: () => 0,
        maxValue: () => 100,
        step: () => 1,
        minStepsBetweenThumbs: () => 0,
        orientation: () => "horizontal",
        isDisabled: () => false,
    }, props);
    const pageSize = createMemo(() => {
        let calcPageSize = (props.maxValue() - props.minValue()) / 10;
        calcPageSize = snapValueToStep(calcPageSize, 0, calcPageSize + props.step(), props.step());
        return Math.max(calcPageSize, props.step());
    });
    const defaultValue = createMemo(() => {
        return props.defaultValue() ?? [props.minValue()];
    });
    const [values, setValues] = createControllableArraySignal({
        value: () => props.value(),
        defaultValue,
        onChange: values => props.onChange?.(values),
    });
    const [isDragging, setIsDragging] = createSignal(new Array(values().length).fill(false));
    const [isEditables, setEditables] = createSignal(new Array(values().length).fill(false));
    const [focusedIndex, setFocusedIndex] = createSignal(undefined);
    const resetValues = () => {
        setValues(defaultValue());
    };
    const getValuePercent = (value) => {
        return (value - props.minValue()) / (props.maxValue() - props.minValue());
    };
    const getThumbMinValue = (index) => {
        return index === 0 ? props.minValue() : values()[index - 1];
    };
    const getThumbMaxValue = (index) => {
        return index === values().length - 1 ? props.maxValue() : values()[index + 1];
    };
    const isThumbEditable = (index) => {
        return isEditables()[index];
    };
    const setThumbEditable = (index) => {
        setEditables(p => {
            p[index] = true;
            return p;
        });
    };
    const updateValue = (index, value) => {
        if (props.isDisabled() || !isThumbEditable(index))
            return;
        value = snapValueToStep(value, getThumbMinValue(index), getThumbMaxValue(index), props.step());
        const nextValues = getNextSortedValues(values(), value, index);
        if (!hasMinStepsBetweenValues(nextValues, props.minStepsBetweenThumbs() * props.step())) {
            return;
        }
        setValues(prev => [...replaceIndex(prev, index, value)]);
    };
    const updateDragging = (index, dragging) => {
        if (props.isDisabled() || !isThumbEditable(index))
            return;
        const wasDragging = isDragging()[index];
        setIsDragging(p => [...replaceIndex(p, index, dragging)]);
        if (wasDragging && !isDragging().some(Boolean)) {
            props.onChangeEnd?.(values());
        }
    };
    const getFormattedValue = (value) => {
        return props.numberFormatter.format(value);
    };
    const setThumbPercent = (index, percent) => {
        updateValue(index, getPercentValue(percent));
    };
    const getRoundedValue = (value) => {
        return (Math.round((value - props.minValue()) / props.step()) * props.step() + props.minValue());
    };
    const getPercentValue = (percent) => {
        const val = percent * (props.maxValue() - props.minValue()) + props.minValue();
        return clamp(getRoundedValue(val), props.minValue(), props.maxValue());
    };
    const incrementThumb = (index, stepSize = 1) => {
        const s = Math.max(stepSize, props.step());
        const nextValue = values()[index] + s;
        const nextValues = getNextSortedValues(values(), nextValue, index);
        if (hasMinStepsBetweenValues(nextValues, props.minStepsBetweenThumbs() * props.step())) {
            updateValue(index, snapValueToStep(nextValue, props.minValue(), props.maxValue(), props.step()));
        }
    };
    const decrementThumb = (index, stepSize = 1) => {
        const s = Math.max(stepSize, props.step());
        const nextValue = values()[index] - s;
        const nextValues = getNextSortedValues(values(), nextValue, index);
        if (hasMinStepsBetweenValues(nextValues, props.minStepsBetweenThumbs() * props.step())) {
            updateValue(index, snapValueToStep(nextValue, props.minValue(), props.maxValue(), props.step()));
        }
    };
    return {
        values,
        getThumbValue: index => values()[index],
        setThumbValue: updateValue,
        setThumbPercent,
        isThumbDragging: index => isDragging()[index],
        setThumbDragging: updateDragging,
        focusedThumb: focusedIndex,
        setFocusedThumb: setFocusedIndex,
        getThumbPercent: index => getValuePercent(values()[index]),
        getValuePercent,
        getThumbValueLabel: index => getFormattedValue(values()[index]),
        getFormattedValue,
        getThumbMinValue,
        getThumbMaxValue,
        getPercentValue,
        isThumbEditable,
        setThumbEditable,
        incrementThumb,
        decrementThumb,
        step: props.step,
        pageSize,
        orientation: props.orientation,
        isDisabled: props.isDisabled,
        setValues,
        resetValues,
    };
}
function replaceIndex(array, index, value) {
    if (array[index] === value) {
        return array;
    }
    return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
