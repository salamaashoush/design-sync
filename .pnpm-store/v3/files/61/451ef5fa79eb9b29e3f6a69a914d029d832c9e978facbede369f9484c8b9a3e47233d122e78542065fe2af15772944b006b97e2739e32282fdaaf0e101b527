import { useCollapsibleContext } from "../collapsible/collapsible-context";
import { Polymorphic } from "../polymorphic";
/**
 * Wraps an `Accordion.Trigger`.
 * Use the `as` prop to update it to the appropriate heading level for your page.
 */
export function AccordionHeader(props) {
    // `Accordion.Item` is a `Collapsible.Root`.
    const context = useCollapsibleContext();
    return <Polymorphic as="h3" {...context.dataset()} {...props}/>;
}
