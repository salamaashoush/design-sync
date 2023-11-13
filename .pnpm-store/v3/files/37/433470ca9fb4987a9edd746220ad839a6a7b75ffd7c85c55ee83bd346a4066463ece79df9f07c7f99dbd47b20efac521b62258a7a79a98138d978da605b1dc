import { Polymorphic } from "../polymorphic";
import { useBreadcrumbsContext } from "./breadcrumbs-context";
/**
 * The visual separator between each breadcrumb items.
 * It will not be visible by screen readers.
 */
export function BreadcrumbsSeparator(props) {
    const context = useBreadcrumbsContext();
    return <Polymorphic as="span" children={context.separator()} aria-hidden="true" {...props}/>;
}
