import { composeEventHandlers } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";
export function PaginationNext(props) {
    const context = usePaginationContext();
    const [local, others] = splitProps(props, ["onClick"]);
    const onClick = () => {
        context.setPage(context.page() + 1);
    };
    const isDisabled = () => context.page() === context.count();
    return (<li>
      <Polymorphic as="button" tabIndex={isDisabled() || context.page() === context.count() ? "-1" : undefined} disabled={isDisabled()} aria-disabled={isDisabled() || undefined} data-disabled={isDisabled() ? "" : undefined} onClick={composeEventHandlers([local.onClick, onClick])} {...others}/>
    </li>);
}
