import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { createControllableSignal } from "../primitives";
import { PaginationContext } from "./pagination-context";
import { Polymorphic } from "../polymorphic";
/**
 * A list of page number that allows users to change the current page.
 */
export function PaginationRoot(props) {
    const defaultId = `pagination-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
    }, props);
    const [local, others] = splitProps(props, [
        "page",
        "defaultPage",
        "onPageChange",
        "count",
        "siblingCount",
        "showFirst",
        "showLast",
        "fixedItems",
        "itemComponent",
        "ellipsisComponent",
        "disabled",
        "children",
    ]);
    const state = createControllableSignal({
        defaultValue: () => local.defaultPage ?? 1,
        onChange: local.onPageChange,
        value: () => local.page,
    });
    const context = {
        count: () => local.count,
        siblingCount: () => local.siblingCount ?? 1,
        showFirst: () => local.showFirst ?? true,
        showLast: () => local.showLast ?? true,
        fixedItems: () => local.fixedItems ?? false,
        isDisabled: () => local.disabled ?? false,
        renderItem: page => local.itemComponent({ page }),
        renderEllipsis: local.ellipsisComponent,
        page: state[0],
        setPage: state[1],
    };
    return (<PaginationContext.Provider value={context}>
      <Polymorphic as="nav" data-disabled={local.disabled ? "" : undefined} {...others}>
        <ul>{local.children}</ul>
      </Polymorphic>
    </PaginationContext.Provider>);
}
