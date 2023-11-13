import { Accessor, JSX, Setter } from "solid-js";
export interface PaginationContextValue {
    count: Accessor<number>;
    siblingCount: Accessor<number>;
    showFirst: Accessor<boolean>;
    showLast: Accessor<boolean>;
    fixedItems: Accessor<boolean | "no-ellipsis">;
    isDisabled: Accessor<boolean>;
    renderItem: (page: number) => JSX.Element;
    renderEllipsis: () => JSX.Element;
    page: Accessor<number>;
    setPage: Setter<number>;
}
export declare const PaginationContext: import("solid-js").Context<PaginationContextValue>;
export declare function usePaginationContext(): PaginationContextValue;
