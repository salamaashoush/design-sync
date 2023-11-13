/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
 */
import { access, createGenerateId, focusWithoutScrolling, isFunction, mergeDefaultProps, } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, createUniqueId, on, splitProps, } from "solid-js";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createCollator } from "../i18n";
import { createListState, ListKeyboardDelegate } from "../list";
import { Polymorphic } from "../polymorphic";
import { PopperRoot } from "../popper";
import { createDisclosureState, createFormResetListener, createPresence, createRegisterId, } from "../primitives";
import { Selection, } from "../selection";
import { SelectContext } from "./select-context";
/**
 * Base component for a select, provide context for its children.
 * Used to build single and multi-select.
 */
export function SelectBase(props) {
    const defaultId = `select-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        selectionMode: "single",
        disallowEmptySelection: false,
        allowDuplicateSelectionEvents: true,
        gutter: 8,
        sameWidth: true,
        modal: false,
        preventScroll: false,
    }, props);
    const [local, popperProps, formControlProps, others] = splitProps(props, [
        "itemComponent",
        "sectionComponent",
        "open",
        "defaultOpen",
        "onOpenChange",
        "value",
        "defaultValue",
        "onChange",
        "placeholder",
        "options",
        "optionValue",
        "optionTextValue",
        "optionDisabled",
        "optionGroupChildren",
        "keyboardDelegate",
        "allowDuplicateSelectionEvents",
        "disallowEmptySelection",
        "disallowTypeAhead",
        "shouldFocusWrap",
        "selectionBehavior",
        "selectionMode",
        "virtualized",
        "modal",
        "preventScroll",
        "forceMount",
    ], [
        "getAnchorRect",
        "placement",
        "gutter",
        "shift",
        "flip",
        "slide",
        "overlap",
        "sameWidth",
        "fitViewport",
        "hideWhenDetached",
        "detachedPadding",
        "arrowPadding",
        "overflowPadding",
    ], FORM_CONTROL_PROP_NAMES);
    const [triggerId, setTriggerId] = createSignal();
    const [valueId, setValueId] = createSignal();
    const [listboxId, setListboxId] = createSignal();
    const [triggerRef, setTriggerRef] = createSignal();
    const [contentRef, setContentRef] = createSignal();
    const [listboxRef, setListboxRef] = createSignal();
    const [listboxAriaLabelledBy, setListboxAriaLabelledBy] = createSignal();
    const [focusStrategy, setFocusStrategy] = createSignal(true);
    const getOptionValue = (option) => {
        const optionValue = local.optionValue;
        if (optionValue == null) {
            // If no `optionValue`, the option itself is the value (ex: string[] of options)
            return String(option);
        }
        // Get the value from the option object as a string.
        return String(isFunction(optionValue) ? optionValue(option) : option[optionValue]);
    };
    // Only options without option groups.
    const flattenOptions = createMemo(() => {
        const optionGroupChildren = local.optionGroupChildren;
        // The combobox doesn't contains option groups.
        if (optionGroupChildren == null) {
            return local.options;
        }
        return local.options.flatMap(item => item[optionGroupChildren] ?? item);
    });
    // Only option keys without option groups.
    const flattenOptionKeys = createMemo(() => {
        return flattenOptions().map(option => getOptionValue(option));
    });
    const getOptionsFromValues = (values) => {
        return [...values]
            .map(value => flattenOptions().find(option => getOptionValue(option) === value))
            .filter(option => option != null);
    };
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const listState = createListState({
        selectedKeys: () => {
            if (local.value != null) {
                return local.value.map(getOptionValue);
            }
            return local.value;
        },
        defaultSelectedKeys: () => {
            if (local.defaultValue != null) {
                return local.defaultValue.map(getOptionValue);
            }
            return local.defaultValue;
        },
        onSelectionChange: selectedKeys => {
            local.onChange?.(getOptionsFromValues(selectedKeys));
            if (local.selectionMode === "single") {
                close();
            }
        },
        allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
        disallowEmptySelection: () => access(local.disallowEmptySelection),
        selectionBehavior: () => access(local.selectionBehavior),
        selectionMode: () => local.selectionMode,
        dataSource: () => local.options ?? [],
        getKey: () => local.optionValue,
        getTextValue: () => local.optionTextValue,
        getDisabled: () => local.optionDisabled,
        getSectionChildren: () => local.optionGroupChildren,
    });
    const selectedOptions = createMemo(() => {
        return getOptionsFromValues(listState.selectionManager().selectedKeys());
    });
    const removeOptionFromSelection = (option) => {
        listState.selectionManager().toggleSelection(getOptionValue(option));
    };
    const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());
    const focusListbox = () => {
        const listboxEl = listboxRef();
        if (listboxEl) {
            focusWithoutScrolling(listboxEl);
        }
    };
    const open = (focusStrategy) => {
        // Don't open if there is no option.
        if (local.options.length <= 0) {
            return;
        }
        setFocusStrategy(focusStrategy);
        disclosureState.open();
        let focusedKey = listState.selectionManager().firstSelectedKey();
        if (focusedKey == null) {
            if (focusStrategy === "first") {
                focusedKey = listState.collection().getFirstKey();
            }
            else if (focusStrategy === "last") {
                focusedKey = listState.collection().getLastKey();
            }
        }
        focusListbox();
        listState.selectionManager().setFocused(true);
        listState.selectionManager().setFocusedKey(focusedKey);
    };
    const close = () => {
        disclosureState.close();
        listState.selectionManager().setFocused(false);
        listState.selectionManager().setFocusedKey(undefined);
    };
    const toggle = (focusStrategy) => {
        if (disclosureState.isOpen()) {
            close();
        }
        else {
            open(focusStrategy);
        }
    };
    const { formControlContext } = createFormControl(formControlProps);
    createFormResetListener(triggerRef, () => {
        const defaultSelectedKeys = local.defaultValue
            ? [...local.defaultValue].map(getOptionValue)
            : new Selection();
        listState.selectionManager().setSelectedKeys(defaultSelectedKeys);
    });
    const collator = createCollator({ usage: "search", sensitivity: "base" });
    // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
    const delegate = createMemo(() => {
        const keyboardDelegate = access(local.keyboardDelegate);
        if (keyboardDelegate) {
            return keyboardDelegate;
        }
        return new ListKeyboardDelegate(listState.collection, undefined, collator);
    });
    const renderItem = (item) => {
        return local.itemComponent?.({ item });
    };
    const renderSection = (section) => {
        return local.sectionComponent?.({ section });
    };
    // Delete selected keys that do not match any option in the listbox.
    createEffect(on([flattenOptionKeys], ([flattenOptionKeys]) => {
        const currentSelectedKeys = [...listState.selectionManager().selectedKeys()];
        const keysToKeep = currentSelectedKeys.filter(key => flattenOptionKeys.includes(key));
        listState.selectionManager().setSelectedKeys(keysToKeep);
    }, {
        defer: true,
    }));
    const dataset = createMemo(() => ({
        "data-expanded": disclosureState.isOpen() ? "" : undefined,
        "data-closed": !disclosureState.isOpen() ? "" : undefined,
    }));
    const context = {
        dataset,
        isOpen: disclosureState.isOpen,
        isDisabled: () => formControlContext.isDisabled() ?? false,
        isMultiple: () => access(local.selectionMode) === "multiple",
        isVirtualized: () => local.virtualized ?? false,
        isModal: () => local.modal ?? false,
        preventScroll: () => local.preventScroll ?? false,
        disallowTypeAhead: () => local.disallowTypeAhead ?? false,
        shouldFocusWrap: () => local.shouldFocusWrap ?? false,
        selectedOptions,
        contentPresence,
        autoFocus: focusStrategy,
        triggerRef,
        listState: () => listState,
        keyboardDelegate: delegate,
        triggerId,
        valueId,
        listboxId,
        listboxAriaLabelledBy,
        setListboxAriaLabelledBy,
        setTriggerRef,
        setContentRef,
        setListboxRef,
        open,
        close,
        toggle,
        placeholder: () => local.placeholder,
        renderItem,
        renderSection,
        removeOptionFromSelection,
        generateId: createGenerateId(() => access(formControlProps.id)),
        registerTriggerId: createRegisterId(setTriggerId),
        registerValueId: createRegisterId(setValueId),
        registerListboxId: createRegisterId(setListboxId),
    };
    return (<FormControlContext.Provider value={formControlContext}>
      <SelectContext.Provider value={context}>
        <PopperRoot anchorRef={triggerRef} contentRef={contentRef} {...popperProps}>
          <Polymorphic as="div" role="group" id={access(formControlProps.id)} {...formControlContext.dataset()} {...dataset()} {...others}/>
        </PopperRoot>
      </SelectContext.Provider>
    </FormControlContext.Provider>);
}
