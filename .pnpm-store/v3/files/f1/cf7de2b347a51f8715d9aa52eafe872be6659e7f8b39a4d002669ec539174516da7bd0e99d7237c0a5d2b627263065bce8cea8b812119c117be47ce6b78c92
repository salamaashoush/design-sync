import { contains, focusWithoutScrolling, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";
import { DismissableLayer } from "../dismissable-layer";
import { useFormControlContext } from "../form-control";
import { PopperPositioner } from "../popper";
import { createFocusScope, createHideOutside, createPreventScroll, } from "../primitives";
import { useDatePickerContext } from "./date-picker-context";
/**
 * The component that pops out when the date picker is open.
 */
export function DatePickerContent(props) {
    let ref;
    const formControlContext = useFormControlContext();
    const context = useDatePickerContext();
    props = mergeDefaultProps({
        id: context.generateId("content"),
    }, props);
    const [local, others] = splitProps(props, [
        "ref",
        "style",
        "onCloseAutoFocus",
        "onPointerDownOutside",
        "onFocusOutside",
        "onInteractOutside",
        "aria-labelledby",
    ]);
    let isRightClickOutside = false;
    let hasInteractedOutside = false;
    let hasPointerDownOutside = false;
    const ariaLabelledBy = () => {
        return formControlContext.getAriaLabelledBy(context.triggerId(), others["aria-label"], local["aria-labelledby"]);
    };
    const onCloseAutoFocus = (e) => {
        local.onCloseAutoFocus?.(e);
        if (context.isModal()) {
            e.preventDefault();
            if (!isRightClickOutside) {
                focusWithoutScrolling(context.triggerRef());
            }
        }
        else {
            if (!e.defaultPrevented) {
                if (!hasInteractedOutside) {
                    focusWithoutScrolling(context.triggerRef());
                }
                // Always prevent autofocus because we either focus manually or want user agent focus
                e.preventDefault();
            }
            hasInteractedOutside = false;
            hasPointerDownOutside = false;
        }
    };
    const onPointerDownOutside = (e) => {
        local.onPointerDownOutside?.(e);
        if (context.isModal()) {
            isRightClickOutside = e.detail.isContextMenu;
        }
    };
    const onFocusOutside = (e) => {
        local.onFocusOutside?.(e);
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        if (context.isModal()) {
            e.preventDefault();
        }
    };
    const onInteractOutside = (e) => {
        local.onInteractOutside?.(e);
        if (context.isModal()) {
            return;
        }
        // Non-modal behavior below
        if (!e.defaultPrevented) {
            hasInteractedOutside = true;
            if (e.detail.originalEvent.type === "pointerdown") {
                hasPointerDownOutside = true;
            }
        }
        // Prevent dismissing when clicking the trigger.
        // As the trigger is already setup to close, without doing so would
        // cause it to close and immediately open.
        if (contains(context.triggerRef(), e.target)) {
            e.preventDefault();
        }
        // On Safari if the trigger is inside a container with tabIndex={0}, when clicked
        // we will get the pointer down outside event on the trigger, but then a subsequent
        // focus outside event on the container, we ignore any focus outside event when we've
        // already had a pointer down outside event.
        if (e.detail.originalEvent.type === "focusin" && hasPointerDownOutside) {
            e.preventDefault();
        }
    };
    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    createHideOutside({
        isDisabled: () => !(context.isModal() && context.isOpen()),
        targets: () => {
            const excludedElements = [];
            if (ref) {
                excludedElements.push(ref);
            }
            const controlEl = context.controlRef();
            if (controlEl) {
                excludedElements.push(controlEl);
            }
            return excludedElements;
        },
    });
    createPreventScroll({
        ownerRef: () => ref,
        isDisabled: () => !(context.isModal() && context.isOpen()),
    });
    createFocusScope({
        trapFocus: () => context.isModal() && context.isOpen(),
        onMountAutoFocus: e => {
            // We prevent open autofocus because it's handled by the `Calendar`.
            e.preventDefault();
        },
        onUnmountAutoFocus: onCloseAutoFocus,
    }, () => ref);
    createEffect(() => onCleanup(context.registerContentId(others.id)));
    return (<Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
            ref = el;
        }, local.ref)} role="dialog" tabIndex={-1} disableOutsidePointerEvents={context.isModal() && context.isOpen()} excludedElements={[context.controlRef]} style={{
            "--kb-date-picker-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
        }} aria-labelledby={ariaLabelledBy()} onPointerDownOutside={onPointerDownOutside} onFocusOutside={onFocusOutside} onInteractOutside={onInteractOutside} onDismiss={context.close} {...context.dataset()} {...others}/>
      </PopperPositioner>
    </Show>);
}
