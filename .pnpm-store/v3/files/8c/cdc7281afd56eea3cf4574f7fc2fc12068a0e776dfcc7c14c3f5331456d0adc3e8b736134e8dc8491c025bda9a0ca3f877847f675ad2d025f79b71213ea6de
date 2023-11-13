import { Orientation } from "@kobalte/utils";
import { Accessor, Setter } from "solid-js";
import { SingleSelectListState } from "../list";
import { TabsActivationMode } from "./types";
export interface TabsContextValue {
    isDisabled: Accessor<boolean>;
    orientation: Accessor<Orientation>;
    activationMode: Accessor<TabsActivationMode>;
    triggerIdsMap: Accessor<Map<string, string>>;
    contentIdsMap: Accessor<Map<string, string>>;
    listState: Accessor<SingleSelectListState>;
    selectedTab: Accessor<HTMLElement | undefined>;
    setSelectedTab: Setter<HTMLElement | undefined>;
    generateTriggerId: (value: string) => string;
    generateContentId: (value: string) => string;
}
export declare const TabsContext: import("solid-js").Context<TabsContextValue>;
export declare function useTabsContext(): TabsContextValue;
