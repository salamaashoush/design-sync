import { Accessor } from "solid-js";
export interface ToastContextValue {
    close: () => void;
    duration: Accessor<number>;
    isPersistent: Accessor<boolean>;
    closeTimerStartTime: Accessor<number>;
    generateId: (part: string) => string;
    registerTitleId: (id: string) => () => void;
    registerDescriptionId: (id: string) => () => void;
}
export declare const ToastContext: import("solid-js").Context<ToastContextValue>;
export declare function useToastContext(): ToastContextValue;
