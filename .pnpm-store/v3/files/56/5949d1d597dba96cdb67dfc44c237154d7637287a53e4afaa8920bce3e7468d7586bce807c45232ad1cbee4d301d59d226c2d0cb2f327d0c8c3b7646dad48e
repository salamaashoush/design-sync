/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-stately/combobox/src/useComboBoxState.ts
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-aria/combobox/src/useComboBox.ts
 */
import { access, createGenerateId, focusWithoutScrolling, isAppleDevice, isFunction, mergeDefaultProps, } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, createUniqueId, on, splitProps, } from "solid-js";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createFilter, createMessageFormatter } from "../i18n";
import { createListState, ListKeyboardDelegate } from "../list";
import { announce } from "../live-announcer";
import { Polymorphic } from "../polymorphic";
import { PopperRoot } from "../popper";
import { createControllableSignal, createDisclosureState, createFormResetListener, createPresence, createRegisterId, getItemCount, } from "../primitives";
import { createSelectableCollection, Selection, } from "../selection";
import { COMBOBOX_INTL_MESSAGES } from "./combobox.intl";
import { ComboboxContext } from "./combobox-context";
/**
 * Base component for a combobox, provide context for its children.
 */
export function ComboboxBase(props) {
    const defaultId = `combobox-${createUniqueId()}`;
    const filter = createFilter({ sensitivity: "base" });
    props = mergeDefaultProps({
        id: defaultId,
        selectionMode: "single",
        allowsEmptyCollection: false,
        disallowEmptySelection: false,
        allowDuplicateSelectionEvents: true,
        removeOnBackspace: true,
        gutter: 8,
        sameWidth: true,
        modal: false,
        preventScroll: false,
        defaultFilter: "contains",
        triggerMode: "input",
    }, props);
    const [local, popperProps, formControlProps, others] = splitProps(props, [
        "itemComponent",
        "sectionComponent",
        "open",
        "defaultOpen",
        "onOpenChange",
        "onInputChange",
        "value",
        "defaultValue",
        "onChange",
        "triggerMode",
        "placeholder",
        "options",
        "optionValue",
        "optionTextValue",
        "optionLabel",
        "optionDisabled",
        "optionGroupChildren",
        "keyboardDelegate",
        "allowDuplicateSelectionEvents",
        "disallowEmptySelection",
        "defaultFilter",
        "shouldFocusWrap",
        "allowsEmptyCollection",
        "removeOnBackspace",
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
    const [listboxId, setListboxId] = createSignal();
    const [controlRef, setControlRef] = createSignal();
    const [inputRef, setInputRef] = createSignal();
    const [triggerRef, setTriggerRef] = createSignal();
    const [contentRef, setContentRef] = createSignal();
    const [listboxRef, setListboxRef] = createSignal();
    const [focusStrategy, setFocusStrategy] = createSignal(false);
    const [isInputFocused, setIsInputFocusedState] = createSignal(false);
    const [showAllOptions, setShowAllOptions] = createSignal(false);
    const [lastDisplayedOptions, setLastDisplayedOptions] = createSignal(local.options);
    const messageFormatter = createMessageFormatter(() => COMBOBOX_INTL_MESSAGES);
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen, openTriggerMode),
    });
    const [inputValue, setInputValue] = createControllableSignal({
        defaultValue: () => "",
        onChange: value => {
            local.onInputChange?.(value);
            // Remove selection when input is cleared and value is uncontrolled (in single selection mode).
            // If controlled, this is the application developer's responsibility.
            if (value === "" &&
                local.selectionMode === "single" &&
                !listState.selectionManager().isEmpty() &&
                local.value === undefined) {
                // Bypass `disallowEmptySelection`.
                listState.selectionManager().setSelectedKeys([]);
            }
            // Clear focused key when input value changes.
            listState.selectionManager().setFocusedKey(undefined);
        },
    });
    const getOptionValue = (option) => {
        const optionValue = local.optionValue;
        if (optionValue == null) {
            // If no `optionValue`, the option itself is the value (ex: string[] of options).
            return String(option);
        }
        // Get the value from the option object as a string.
        return String(isFunction(optionValue) ? optionValue(option) : option[optionValue]);
    };
    const getOptionLabel = (option) => {
        const optionLabel = local.optionLabel;
        if (optionLabel == null) {
            // If no `optionLabel`, the option itself is the label (ex: string[] of options).
            return String(option);
        }
        // Get the label from the option object as a string.
        return String(isFunction(optionLabel) ? optionLabel(option) : option[optionLabel]);
    };
    // All options flattened without option groups.
    const allOptions = createMemo(() => {
        const optionGroupChildren = local.optionGroupChildren;
        // The combobox doesn't contains option groups.
        if (optionGroupChildren == null) {
            return local.options;
        }
        return local.options.flatMap(item => item[optionGroupChildren] ?? item);
    });
    const filterFn = (option) => {
        const inputVal = inputValue() ?? "";
        if (isFunction(local.defaultFilter)) {
            return local.defaultFilter?.(option, inputVal);
        }
        const textVal = getOptionLabel(option);
        switch (local.defaultFilter) {
            case "startsWith":
                return filter.startsWith(textVal, inputVal);
            case "endsWith":
                return filter.endsWith(textVal, inputVal);
            case "contains":
                return filter.contains(textVal, inputVal);
        }
    };
    // Filtered options with same structure as `local.options`
    const filteredOptions = createMemo(() => {
        const optionGroupChildren = local.optionGroupChildren;
        // The combobox doesn't contains option groups.
        if (optionGroupChildren == null) {
            return local.options.filter(filterFn);
        }
        const filteredGroups = [];
        for (const optGroup of local.options) {
            // Filter options of the group
            const filteredChildrenOptions = optGroup[optionGroupChildren].filter(filterFn);
            // Don't add any groups that are empty
            if (filteredChildrenOptions.length === 0)
                continue;
            // Add the group with the filtered options
            filteredGroups.push({
                ...optGroup,
                [optionGroupChildren]: filteredChildrenOptions,
            });
        }
        return filteredGroups;
    });
    const displayedOptions = createMemo(() => {
        if (disclosureState.isOpen()) {
            if (showAllOptions()) {
                return local.options;
            }
            else {
                return filteredOptions();
            }
        }
        else {
            return lastDisplayedOptions();
        }
    });
    // Track what action is attempting to open the combobox.
    let openTriggerMode = "focus";
    const getOptionsFromValues = (values) => {
        return [...values]
            .map(value => allOptions().find(option => getOptionValue(option) === value))
            .filter(option => option != null);
    };
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
                // Only close if an option is selected.
                // Prevents the combobox to close and reopen when the input is cleared.
                if (disclosureState.isOpen() && selectedKeys.size > 0) {
                    close();
                }
            }
            const inputEl = inputRef();
            if (inputEl) {
                // Move cursor to the end of the input.
                inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
                focusWithoutScrolling(inputEl);
            }
        },
        allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
        disallowEmptySelection: () => local.disallowEmptySelection,
        selectionBehavior: () => access(local.selectionBehavior),
        selectionMode: () => local.selectionMode,
        dataSource: displayedOptions,
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
    const open = (focusStrategy, triggerMode) => {
        // Show all option if menu is manually opened.
        const showAllOptions = setShowAllOptions(triggerMode === "manual");
        const hasOptions = showAllOptions ? local.options.length > 0 : filteredOptions().length > 0;
        // Don't open if there is no option.
        if (!hasOptions && !local.allowsEmptyCollection) {
            return;
        }
        openTriggerMode = triggerMode;
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
        listState.selectionManager().setFocused(true);
        listState.selectionManager().setFocusedKey(focusedKey);
    };
    const close = () => {
        disclosureState.close();
        listState.selectionManager().setFocused(false);
        listState.selectionManager().setFocusedKey(undefined);
    };
    const toggle = (focusStrategy, triggerMode) => {
        if (disclosureState.isOpen()) {
            close();
        }
        else {
            open(focusStrategy, triggerMode);
        }
    };
    const { formControlContext } = createFormControl(formControlProps);
    createFormResetListener(inputRef, () => {
        const defaultSelectedKeys = local.defaultValue
            ? [...local.defaultValue].map(getOptionValue)
            : new Selection();
        listState.selectionManager().setSelectedKeys(defaultSelectedKeys);
    });
    // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
    const delegate = createMemo(() => {
        const keyboardDelegate = access(local.keyboardDelegate);
        if (keyboardDelegate) {
            return keyboardDelegate;
        }
        return new ListKeyboardDelegate(listState.collection, listboxRef, undefined);
    });
    // Use `createSelectableCollection` to get the keyboard handlers to apply to the input.
    const selectableCollection = createSelectableCollection({
        selectionManager: () => listState.selectionManager(),
        keyboardDelegate: delegate,
        disallowTypeAhead: true,
        disallowEmptySelection: true,
        shouldFocusWrap: () => local.shouldFocusWrap,
        // Prevent item scroll behavior from being applied here, handled in the Listbox component.
        isVirtualized: true,
    }, inputRef);
    const setIsInputFocused = (isFocused) => {
        if (isFocused && local.triggerMode === "focus") {
            open(false, "focus");
        }
        setIsInputFocusedState(isFocused);
        listState.selectionManager().setFocused(isFocused);
    };
    const activeDescendant = createMemo(() => {
        const focusedKey = listState.selectionManager().focusedKey();
        if (focusedKey) {
            return listboxRef()?.querySelector(`[data-key="${focusedKey}"]`)?.id;
        }
        return undefined;
    });
    const resetInputValue = (selectedKeys) => {
        if (local.selectionMode === "single") {
            const selectedKey = [...selectedKeys][0];
            const selectedOption = allOptions().find(option => getOptionValue(option) === selectedKey);
            setInputValue(selectedOption ? getOptionLabel(selectedOption) : "");
        }
        else {
            setInputValue("");
        }
    };
    const renderItem = (item) => {
        return local.itemComponent?.({ item });
    };
    const renderSection = (section) => {
        return local.sectionComponent?.({ section });
    };
    // If combobox is going to close, freeze the displayed options
    // Prevents the popover contents from updating as the combobox closes.
    createEffect(on([filteredOptions, showAllOptions], (input, prevInput) => {
        if (disclosureState.isOpen() && prevInput != null) {
            const prevFilteredOptions = prevInput[0];
            const prevShowAllOptions = prevInput[1];
            setLastDisplayedOptions(prevShowAllOptions ? local.options : prevFilteredOptions);
        }
        else {
            const filteredOptions = input[0];
            const showAllOptions = input[1];
            setLastDisplayedOptions(showAllOptions ? local.options : filteredOptions);
        }
    }));
    // Display filtered collection again when input value changes.
    createEffect(on(inputValue, () => {
        if (showAllOptions()) {
            setShowAllOptions(false);
        }
    }));
    // Reset input value when selection change
    createEffect(on(() => listState.selectionManager().selectedKeys(), resetInputValue));
    // VoiceOver has issues with announcing aria-activedescendant properly on change.
    // We use a live region announcer to announce focus changes manually.
    let lastAnnouncedFocusedKey = "";
    createEffect(() => {
        const focusedKey = listState.selectionManager().focusedKey() ?? "";
        const focusedItem = listState.collection().getItem(focusedKey);
        if (isAppleDevice() && focusedItem != null && focusedKey !== lastAnnouncedFocusedKey) {
            const isSelected = listState.selectionManager().isSelected(focusedKey);
            const announcement = messageFormatter().format("focusAnnouncement", {
                optionText: focusedItem?.textValue || "",
                isSelected,
            });
            announce(announcement);
        }
        if (focusedKey) {
            lastAnnouncedFocusedKey = focusedKey;
        }
    });
    // Announce the number of available suggestions when it changes.
    let lastOptionCount = getItemCount(listState.collection());
    let lastOpen = disclosureState.isOpen();
    createEffect(() => {
        const optionCount = getItemCount(listState.collection());
        const isOpen = disclosureState.isOpen();
        // Only announce the number of options available when the menu opens if there is no
        // focused item, otherwise screen readers will typically read e.g. "1 of 6".
        // The exception is VoiceOver since this isn't included in the message above.
        const didOpenWithoutFocusedItem = isOpen !== lastOpen && (listState.selectionManager().focusedKey() == null || isAppleDevice());
        if (isOpen && (didOpenWithoutFocusedItem || optionCount !== lastOptionCount)) {
            const announcement = messageFormatter().format("countAnnouncement", { optionCount });
            announce(announcement);
        }
        lastOptionCount = optionCount;
        lastOpen = isOpen;
    });
    // Announce when a selection occurs for VoiceOver.
    // Other screen readers typically do this automatically.
    let lastAnnouncedSelectedKey = "";
    createEffect(() => {
        const lastSelectedKey = [...listState.selectionManager().selectedKeys()].pop() ?? "";
        const lastSelectedItem = listState.collection().getItem(lastSelectedKey);
        if (isAppleDevice() &&
            isInputFocused() &&
            lastSelectedItem &&
            lastSelectedKey !== lastAnnouncedSelectedKey) {
            const announcement = messageFormatter().format("selectedAnnouncement", {
                optionText: lastSelectedItem?.textValue || "",
            });
            announce(announcement);
        }
        if (lastSelectedKey) {
            lastAnnouncedSelectedKey = lastSelectedKey;
        }
    });
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
        allowsEmptyCollection: () => local.allowsEmptyCollection ?? false,
        shouldFocusWrap: () => local.shouldFocusWrap ?? false,
        removeOnBackspace: () => local.removeOnBackspace ?? true,
        selectedOptions,
        isInputFocused,
        contentPresence,
        autoFocus: focusStrategy,
        inputValue,
        triggerMode: () => local.triggerMode,
        activeDescendant,
        controlRef,
        inputRef,
        triggerRef,
        contentRef,
        listState: () => listState,
        keyboardDelegate: delegate,
        listboxId,
        triggerAriaLabel: () => messageFormatter().format("triggerLabel"),
        listboxAriaLabel: () => messageFormatter().format("listboxLabel"),
        setIsInputFocused,
        resetInputValue,
        setInputValue,
        setControlRef,
        setInputRef,
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
        onInputKeyDown: e => selectableCollection.onKeyDown(e),
        generateId: createGenerateId(() => access(formControlProps.id)),
        registerListboxId: createRegisterId(setListboxId),
    };
    return (<FormControlContext.Provider value={formControlContext}>
      <ComboboxContext.Provider value={context}>
        <PopperRoot anchorRef={controlRef} contentRef={contentRef} {...popperProps}>
          <Polymorphic as="div" role="group" id={access(formControlProps.id)} {...formControlContext.dataset()} {...dataset()} {...others}/>
        </PopperRoot>
      </ComboboxContext.Provider>
    </FormControlContext.Provider>);
}
