/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBox.ts
 */
import { access, composeEventHandlers, createGenerateId, Key, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createMemo, createUniqueId, Match, Show, splitProps, Switch, } from "solid-js";
import { createListState, createSelectableList } from "../list";
import { Polymorphic } from "../polymorphic";
import { ListboxContext } from "./listbox-context";
/**
 * Listbox presents a list of options and allows a user to select one or more of them.
 */
export function ListboxRoot(props) {
    let ref;
    const defaultId = `listbox-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        selectionMode: "single",
        virtualized: false,
    }, props);
    const [local, others] = splitProps(props, [
        "ref",
        "children",
        "renderItem",
        "renderSection",
        "value",
        "defaultValue",
        "onChange",
        "options",
        "optionValue",
        "optionTextValue",
        "optionDisabled",
        "optionGroupChildren",
        "state",
        "keyboardDelegate",
        "autoFocus",
        "selectionMode",
        "shouldFocusWrap",
        "shouldUseVirtualFocus",
        "shouldSelectOnPressUp",
        "shouldFocusOnHover",
        "allowDuplicateSelectionEvents",
        "disallowEmptySelection",
        "selectionBehavior",
        "selectOnFocus",
        "disallowTypeAhead",
        "allowsTabNavigation",
        "virtualized",
        "scrollToItem",
        "scrollRef",
        "onKeyDown",
        "onMouseDown",
        "onFocusIn",
        "onFocusOut",
    ]);
    const listState = createMemo(() => {
        if (local.state) {
            return local.state;
        }
        return createListState({
            selectedKeys: () => local.value,
            defaultSelectedKeys: () => local.defaultValue,
            onSelectionChange: local.onChange,
            allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
            disallowEmptySelection: () => access(local.disallowEmptySelection),
            selectionBehavior: () => access(local.selectionBehavior),
            selectionMode: () => access(local.selectionMode),
            dataSource: () => local.options ?? [],
            getKey: () => local.optionValue,
            getTextValue: () => local.optionTextValue,
            getDisabled: () => local.optionDisabled,
            getSectionChildren: () => local.optionGroupChildren,
        });
    });
    const selectableList = createSelectableList({
        selectionManager: () => listState().selectionManager(),
        collection: () => listState().collection(),
        autoFocus: () => access(local.autoFocus),
        shouldFocusWrap: () => access(local.shouldFocusWrap),
        keyboardDelegate: () => local.keyboardDelegate,
        disallowEmptySelection: () => access(local.disallowEmptySelection),
        selectOnFocus: () => access(local.selectOnFocus),
        disallowTypeAhead: () => access(local.disallowTypeAhead),
        shouldUseVirtualFocus: () => access(local.shouldUseVirtualFocus),
        allowsTabNavigation: () => access(local.allowsTabNavigation),
        isVirtualized: () => local.virtualized,
        scrollToKey: () => local.scrollToItem,
    }, () => ref, () => local.scrollRef?.());
    const context = {
        listState,
        generateId: createGenerateId(() => others.id),
        shouldUseVirtualFocus: () => props.shouldUseVirtualFocus,
        shouldSelectOnPressUp: () => props.shouldSelectOnPressUp,
        shouldFocusOnHover: () => props.shouldFocusOnHover,
        isVirtualized: () => local.virtualized,
    };
    return (<ListboxContext.Provider value={context}>
      <Polymorphic as="ul" ref={mergeRefs(el => (ref = el), local.ref)} role="listbox" tabIndex={selectableList.tabIndex()} aria-multiselectable={listState().selectionManager().selectionMode() === "multiple" ? true : undefined} onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.onKeyDown])} onMouseDown={composeEventHandlers([local.onMouseDown, selectableList.onMouseDown])} onFocusIn={composeEventHandlers([local.onFocusIn, selectableList.onFocusIn])} onFocusOut={composeEventHandlers([local.onFocusOut, selectableList.onFocusOut])} {...others}>
        <Show when={!local.virtualized} fallback={local.children?.(listState().collection)}>
          <Key each={[...listState().collection()]} by="key">
            {item => (<Switch>
                <Match when={item().type === "section"}>{local.renderSection?.(item())}</Match>
                <Match when={item().type === "item"}>{local.renderItem?.(item())}</Match>
              </Switch>)}
          </Key>
        </Show>
      </Polymorphic>
    </ListboxContext.Provider>);
}
