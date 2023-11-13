import { Accessor } from "solid-js";
export interface AccordionItemContextValue {
    value: Accessor<string>;
    triggerId: Accessor<string | undefined>;
    contentId: Accessor<string | undefined>;
    generateId: (part: string) => string;
    registerTriggerId: (id: string) => () => void;
    registerContentId: (id: string) => () => void;
}
export declare const AccordionItemContext: import("solid-js").Context<AccordionItemContextValue>;
export declare function useAccordionItemContext(): AccordionItemContextValue;
