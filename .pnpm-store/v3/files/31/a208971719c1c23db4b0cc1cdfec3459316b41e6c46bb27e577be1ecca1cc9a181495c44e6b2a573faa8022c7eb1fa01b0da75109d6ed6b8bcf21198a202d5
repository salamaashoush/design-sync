/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-stately/tabs/src/useTabListState.ts
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabList.ts
 */
import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, createSignal, createUniqueId, on, splitProps } from "solid-js";
import { createSingleSelectListState } from "../list";
import { Polymorphic } from "../polymorphic";
import { createDomCollection } from "../primitives/create-dom-collection";
import { TabsContext } from "./tabs-context";
/**
 * A set of layered sections of content, known as tab panels, that display one panel of content at a time.
 * `Tabs` contains all the parts of a tabs component and provide context for its children.
 */
export function TabsRoot(props) {
    const defaultId = `tabs-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        orientation: "horizontal",
        activationMode: "automatic",
    }, props);
    const [local, others] = splitProps(props, [
        "value",
        "defaultValue",
        "onChange",
        "orientation",
        "activationMode",
        "disabled",
    ]);
    const [items, setItems] = createSignal([]);
    const [selectedTab, setSelectedTab] = createSignal();
    const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });
    const listState = createSingleSelectListState({
        selectedKey: () => local.value,
        defaultSelectedKey: () => local.defaultValue,
        onSelectionChange: key => local.onChange?.(String(key)),
        dataSource: items,
    });
    let lastSelectedKey = listState.selectedKey();
    createEffect(on([
        () => listState.selectionManager(),
        () => listState.collection(),
        () => listState.selectedKey(),
    ], ([selectionManager, collection, currentSelectedKey]) => {
        let selectedKey = currentSelectedKey;
        // Ensure a tab is always selected (in case no selected key was specified or if selected item was deleted from collection)
        if (selectionManager.isEmpty() || selectedKey == null || !collection.getItem(selectedKey)) {
            selectedKey = collection.getFirstKey();
            let selectedItem = selectedKey != null ? collection.getItem(selectedKey) : undefined;
            // loop over tabs until we find one that isn't disabled and select that
            while (selectedItem?.disabled && selectedItem.key !== collection.getLastKey()) {
                selectedKey = collection.getKeyAfter(selectedItem.key);
                selectedItem = selectedKey != null ? collection.getItem(selectedKey) : undefined;
            }
            // if this check is true, then every item is disabled, it makes more sense to default to the first key than the last
            if (selectedItem?.disabled && selectedKey === collection.getLastKey()) {
                selectedKey = collection.getFirstKey();
            }
            // directly set selection because replace/toggle selection won't consider disabled keys
            if (selectedKey != null) {
                selectionManager.setSelectedKeys([selectedKey]);
            }
        }
        // If there isn't a focused key yet or the tabs doesn't have focus and the selected key changes,
        // change focused key to the selected key if it exists.
        if (selectionManager.focusedKey() == null ||
            (!selectionManager.isFocused() && selectedKey !== lastSelectedKey)) {
            selectionManager.setFocusedKey(selectedKey);
        }
        lastSelectedKey = selectedKey;
    }));
    // associated value/trigger ids
    const triggerIdsMap = new Map();
    // associated value/content ids
    const contentIdsMap = new Map();
    const context = {
        isDisabled: () => local.disabled ?? false,
        orientation: () => local.orientation,
        activationMode: () => local.activationMode,
        triggerIdsMap: () => triggerIdsMap,
        contentIdsMap: () => contentIdsMap,
        listState: () => listState,
        selectedTab,
        setSelectedTab,
        generateTriggerId: value => `${others.id}-trigger-${value}`,
        generateContentId: value => `${others.id}-content-${value}`,
    };
    return (<DomCollectionProvider>
      <TabsContext.Provider value={context}>
        <Polymorphic as="div" data-orientation={context.orientation()} {...others}/>
      </TabsContext.Provider>
    </DomCollectionProvider>);
}
