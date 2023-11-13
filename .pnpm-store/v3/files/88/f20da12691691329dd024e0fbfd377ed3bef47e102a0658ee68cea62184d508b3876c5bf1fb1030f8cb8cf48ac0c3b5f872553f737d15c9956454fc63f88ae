import { Accessor } from "solid-js";
import { ToastConfig, ToastSwipeDirection } from "./types";
export interface ToastRegionContextValue {
    isPaused: Accessor<boolean>;
    toasts: Accessor<ToastConfig[]>;
    hotkey: Accessor<string[]>;
    duration: Accessor<number>;
    swipeDirection: Accessor<ToastSwipeDirection>;
    swipeThreshold: Accessor<number>;
    pauseOnInteraction: Accessor<boolean>;
    pauseOnPageIdle: Accessor<boolean>;
    pauseAllTimer: () => void;
    resumeAllTimer: () => void;
    generateId: (part: string) => string;
}
export declare const ToastRegionContext: import("solid-js").Context<ToastRegionContextValue>;
export declare function useToastRegionContext(): ToastRegionContextValue;
