import { composeEventHandlers } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";
export function PaginationItem(props) {
    const context = usePaginationContext();
    const [local, others] = splitProps(props, ["page", "onClick"]);
    const isCurrent = () => {
        return context.page() === local.page;
    };
    const onClick = () => {
        context.setPage(local.page);
    };
    return (<li>
      <Polymorphic as="button" aria-current={isCurrent() ? "page" : undefined} data-current={isCurrent() ? "" : undefined} onClick={composeEventHandlers([local.onClick, onClick])} {...others}/>
    </li>);
}
