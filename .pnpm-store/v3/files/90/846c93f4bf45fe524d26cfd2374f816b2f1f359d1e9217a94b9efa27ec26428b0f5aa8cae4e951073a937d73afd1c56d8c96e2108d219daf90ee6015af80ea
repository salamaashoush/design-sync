import { OverrideComponentProps } from "@kobalte/utils";
import { Component, JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
export interface PaginationRootOptions extends AsChildProp {
    /** The controlled page number of the pagination. (1-indexed) */
    page?: number;
    /**
     * The default page number when initially rendered. (1-indexed)
     * Useful when you do not need to control the page number.
     */
    defaultPage?: number;
    /** Event handler called when the page number changes. */
    onPageChange?: (page: number) => void;
    /** The number of pages for the pagination. */
    count: number;
    /** The number of siblings to show around the current page item. */
    siblingCount?: number;
    /** Whether to always show the first page item. */
    showFirst?: boolean;
    /** Whether to always show the last page item. */
    showLast?: boolean;
    /**
     * Whether to always show the same number of items (to avoid content shift).
     * Special value: "no-ellipsis" does not count the ellipsis as an item (used when ellipsis are disabled).
     */
    fixedItems?: boolean | "no-ellipsis";
    /** The component to render as an item in the `Pagination.List`. */
    itemComponent: Component<{
        page: number;
    }>;
    /** The component to render as an ellipsis item in the `Pagination.List`. */
    ellipsisComponent: () => JSX.Element;
    /** Whether the pagination is disabled. */
    disabled?: boolean;
}
export interface PaginationRootProps extends OverrideComponentProps<"nav", PaginationRootOptions> {
}
/**
 * A list of page number that allows users to change the current page.
 */
export declare function PaginationRoot(props: PaginationRootProps): JSX.Element;
