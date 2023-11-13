/*!
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/8546c580fdcaa9653edc6f4813103349a96cfb09/src/mantine-core/src/Transition/use-transition.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
import { TransitionStyles } from "./types";
export interface TransitionOptions {
    /** The transition styles. */
    transition: TransitionStyles;
    /** Transitions duration (in ms). */
    duration?: number;
    /** Exit transition duration (in ms). */
    exitDuration?: number;
    /** Delay before starting transitions (in ms). */
    delay?: number;
    /** Delay before starting the exit transition (in ms). */
    exitDelay?: number;
    /** Transitions timing function. */
    easing?: JSX.CSSProperties["transition-timing-function"];
    /** Exit transition timing function. */
    exitEasing?: JSX.CSSProperties["transition-timing-function"];
    /** A function that will be called when enter transition starts. */
    onBeforeEnter?: () => void;
    /** A function that will be called when enter transition ends. */
    onAfterEnter?: () => void;
    /** A function that will be called when exit transition starts. */
    onBeforeExit?: () => void;
    /** A function that will be called when exit transition ends. */
    onAfterExit?: () => void;
}
export interface TransitionResult {
    /** Whether the element should be kept in the DOM. */
    keepMounted: Accessor<boolean>;
    /** The transition style to apply on the element. */
    style: Accessor<JSX.CSSProperties>;
}
/**
 * Primitive for working with enter/exit transitions.
 *
 * @param shouldMount Whether the component should be mounted.
 * @param options The transition options.
 */
export declare function createTransition(shouldMount: MaybeAccessor<boolean>, options: MaybeAccessor<TransitionOptions>): TransitionResult;
