/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-aria/progress/src/useProgressBar.ts
 */
import { clamp, createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { createNumberFormatter } from "../i18n";
import { Polymorphic } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { ProgressContext } from "./progress-context";
/**
 * Progress show either determinate or indeterminate progress of an operation over time.
 */
export function ProgressRoot(props) {
    const defaultId = `progress-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        value: 0,
        minValue: 0,
        maxValue: 100,
    }, props);
    const [local, others] = splitProps(props, [
        "value",
        "minValue",
        "maxValue",
        "indeterminate",
        "getValueLabel",
    ]);
    const [labelId, setLabelId] = createSignal();
    const defaultFormatter = createNumberFormatter(() => ({ style: "percent" }));
    const value = () => {
        return clamp(local.value, local.minValue, local.maxValue);
    };
    const valuePercent = () => {
        return (value() - local.minValue) / (local.maxValue - local.minValue);
    };
    const valueLabel = () => {
        if (local.indeterminate) {
            return undefined;
        }
        if (local.getValueLabel) {
            return local.getValueLabel({
                value: value(),
                min: local.minValue,
                max: local.maxValue,
            });
        }
        return defaultFormatter().format(valuePercent());
    };
    const progressFillWidth = () => {
        return local.indeterminate ? undefined : `${Math.round(valuePercent() * 100)}%`;
    };
    const dataset = createMemo(() => {
        let dataProgress = undefined;
        if (!local.indeterminate) {
            dataProgress = valuePercent() === 1 ? "complete" : "loading";
        }
        return {
            "data-progress": dataProgress,
            "data-indeterminate": local.indeterminate ? "" : undefined,
        };
    });
    const context = {
        dataset,
        value,
        valuePercent,
        valueLabel,
        labelId,
        progressFillWidth,
        generateId: createGenerateId(() => others.id),
        registerLabelId: createRegisterId(setLabelId),
    };
    return (<ProgressContext.Provider value={context}>
      <Polymorphic as="div" role="progressbar" aria-valuenow={local.indeterminate ? undefined : value()} aria-valuemin={local.minValue} aria-valuemax={local.maxValue} aria-valuetext={valueLabel()} aria-labelledby={labelId()} {...dataset()} {...others}/>
    </ProgressContext.Provider>);
}
