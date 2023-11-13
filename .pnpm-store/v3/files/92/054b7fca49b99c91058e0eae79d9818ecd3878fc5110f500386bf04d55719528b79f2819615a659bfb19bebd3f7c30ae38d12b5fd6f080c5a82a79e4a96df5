import { focusWithoutScrolling, mergeRefs } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { DismissableLayer } from "../dismissable-layer";
import { PopperPositioner } from "../popper";
import { createFocusScope, createHideOutside, createPreventScroll, } from "../primitives";
import { useComboboxContext } from "./combobox-context";
/**
 * The component that pops out when the combobox is open.
 */
export function ComboboxContent(props) {
    let ref;
    const context = useComboboxContext();
    const [local, others] = splitProps(props, [
        "ref",
        "id",
        "style",
        "onCloseAutoFocus",
        "onFocusOutside",
    ]);
    const close = () => {
        context.resetInputValue(context.listState().selectionManager().selectedKeys());
        context.close();
    };
    const onFocusOutside = (e) => {
        local.onFocusOutside?.(e);
        // When focus is trapped (in modal mode), a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        if (context.isOpen() && context.isModal()) {
            e.preventDefault();
        }
    };
    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    createHideOutside({
        isDisabled: () => !(context.isOpen() && context.isModal()),
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
        isDisabled: () => !(context.isOpen() && (context.isModal() || context.preventScroll())),
    });
    createFocusScope({
        trapFocus: () => context.isOpen() && context.isModal(),
        onMountAutoFocus: e => {
            // We prevent open autofocus because it's handled by the `Listbox`.
            e.preventDefault();
        },
        onUnmountAutoFocus: e => {
            local.onCloseAutoFocus?.(e);
            if (!e.defaultPrevented) {
                focusWithoutScrolling(context.inputRef());
                e.preventDefault();
            }
        },
    }, () => ref);
    return (<Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
            ref = el;
        }, local.ref)} disableOutsidePointerEvents={context.isModal() && context.isOpen()} excludedElements={[context.controlRef]} style={{
            "--kb-combobox-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
        }} onFocusOutside={onFocusOutside} onDismiss={close} {...context.dataset()} {...others}/>
      </PopperPositioner>
    </Show>);
}
