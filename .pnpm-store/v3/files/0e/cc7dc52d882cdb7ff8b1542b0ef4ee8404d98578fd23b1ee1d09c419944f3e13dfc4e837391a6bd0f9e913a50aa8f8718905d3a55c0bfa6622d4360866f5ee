/*!
 * This file is based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/ariaHideOutside.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
export interface CreateHideOutsideProps {
    /** The elements that should remain visible. */
    targets: MaybeAccessor<Array<Element>>;
    /** Nothing will be hidden above this element. */
    root?: MaybeAccessor<HTMLElement | undefined>;
    /** Whether the hide outside behavior is disabled or not. */
    isDisabled?: MaybeAccessor<boolean | undefined>;
}
/**
 * Hides all elements in the DOM outside the given targets from screen readers
 * using aria-hidden, and returns a function to revert these changes.
 * In addition, changes to the DOM are watched and new elements
 * outside the targets are automatically hidden.
 */
export declare function createHideOutside(props: CreateHideOutsideProps): void;
/**
 * Hides all elements in the DOM outside the given targets from screen readers using aria-hidden,
 * and returns a function to revert these changes. In addition, changes to the DOM are watched
 * and new elements outside the targets are automatically hidden.
 * @param targets - The elements that should remain visible.
 * @param root - Nothing will be hidden above this element.
 * @returns - A function to restore all hidden elements.
 */
export declare function ariaHideOutside(targets: Element[], root?: HTMLElement): () => void;
