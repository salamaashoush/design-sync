import { Accessor } from "solid-js";
export interface ProgressDataSet {
    "data-progress": "loading" | "complete" | undefined;
    "data-indeterminate": string | undefined;
}
export interface ProgressContextValue {
    dataset: Accessor<ProgressDataSet>;
    value: Accessor<number>;
    valuePercent: Accessor<number>;
    valueLabel: Accessor<string | undefined>;
    progressFillWidth: Accessor<string | undefined>;
    labelId: Accessor<string | undefined>;
    generateId: (part: string) => string;
    registerLabelId: (id: string) => () => void;
}
export declare const ProgressContext: import("solid-js").Context<ProgressContextValue>;
export declare function useProgressContext(): ProgressContextValue;
