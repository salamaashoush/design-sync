import { Tabs as KTabs } from "@kobalte/core/tabs";
import { ComponentProps, For, JSXElement, splitProps } from "solid-js";
import { content, list, root, trigger } from "./tabs.css";

interface Tab {
  value: string;
  label: string;
  content: JSXElement;
}

interface TabsProps extends ComponentProps<typeof KTabs> {
  tabs: Tab[];
}

export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, ["tabs"]);

  return (
    <KTabs class={root} {...rest}>
      <KTabs.List class={list}>
        <For each={local.tabs}>
          {(tab) => (
            <KTabs.Trigger class={trigger} value={tab.value}>
              {tab.label}
            </KTabs.Trigger>
          )}
        </For>
      </KTabs.List>
      <For each={local.tabs}>
        {(tab) => (
          <KTabs.Content class={content} value={tab.value}>
            {tab.content}
          </KTabs.Content>
        )}
      </For>
    </KTabs>
  );
}

export const TabsRoot = KTabs;
export const TabsList = KTabs.List;
export const TabsTrigger = KTabs.Trigger;
export const TabsContent = KTabs.Content;
