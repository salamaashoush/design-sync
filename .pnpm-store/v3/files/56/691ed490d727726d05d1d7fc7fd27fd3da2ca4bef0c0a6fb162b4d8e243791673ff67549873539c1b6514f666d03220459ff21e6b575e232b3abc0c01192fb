import { ShowToastOptions, ToastComponent, ToastPromiseComponent } from "./types";
/** Adds a new toast to the visible toasts or queue depending on current state and limit, and return the id of the created toast. */
declare function show(toastComponent: ToastComponent, options?: ShowToastOptions): number;
/** Update the toast of the given id with a new rendered component. */
declare function update(id: number, toastComponent: ToastComponent): void;
/** Adds a new promise-based toast to the visible toasts or queue depending on current state and limit, and return the id of the created toast. */
declare function promise<T, U = any>(promise: Promise<T> | (() => Promise<T>), toastComponent: ToastPromiseComponent<T, U>, options?: ShowToastOptions): number;
/** Removes toast with given id from visible toasts and queue. */
declare function dismiss(id: number): number;
/** Removes all toasts from visible toasts and queue. */
declare function clear(): void;
export declare const toaster: {
    show: typeof show;
    update: typeof update;
    promise: typeof promise;
    dismiss: typeof dismiss;
    clear: typeof clear;
};
export {};
