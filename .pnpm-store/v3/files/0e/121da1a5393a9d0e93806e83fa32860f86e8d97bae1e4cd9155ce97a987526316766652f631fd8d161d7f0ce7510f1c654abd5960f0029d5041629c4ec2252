import { composeEventHandlers, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";
export function PaginationPrevious(props) {
    const context = usePaginationContext();
    props = mergeDefaultProps({
        type: "button",
    }, props);
    const [local, others] = splitProps(props, ["onClick"]);
    const onClick = () => {
        context.setPage(context.page() - 1);
    };
    const isDisabled = () => context.page() === 1;
    return (<li>
      <Polymorphic as="button" tabIndex={isDisabled() || context.page() === 1 ? "-1" : undefined} disabled={isDisabled()} aria-disabled={isDisabled() || undefined} data-disabled={isDisabled() ? "" : undefined} onClick={composeEventHandlers([local.onClick, onClick])} {...others}/>
    </li>);
}
