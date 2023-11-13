/*!
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/8546c580fdcaa9653edc6f4813103349a96cfb09/src/mantine-core/src/Transition/get-transition-styles/get-transition-styles.ts
 */
import { JSX } from "solid-js";
import { TransitionStyles } from "./types";
declare const TRANSITION_PHASES_MAP: {
    readonly beforeEnter: "out";
    readonly enter: "in";
    readonly afterEnter: "in";
    readonly beforeExit: "in";
    readonly exit: "out";
    readonly afterExit: "out";
};
export type TransitionPhase = keyof typeof TRANSITION_PHASES_MAP;
interface GetTransitionStylesParams {
    transition: TransitionStyles;
    phase: TransitionPhase;
    duration: number;
    easing: JSX.CSSProperties["transition-timing-function"];
}
export declare function getTransitionStyles(params: GetTransitionStylesParams): JSX.CSSProperties;
export {};
