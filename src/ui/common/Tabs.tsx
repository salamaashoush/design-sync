import { createSignal, For, JSXElement } from "solid-js";

interface Tab {
  name: string;
  content: JSXElement;
}

interface TabsProps {
  tabs: Tab[];
  mode?: "horizontal" | "vertical";
}
export function Tabs({ tabs: tabsProps, mode = "horizontal" }: TabsProps) {
  const [activeTab, setActiveTab] = createSignal(0);
  const [tabs] = createSignal(tabsProps);
  return (
    <div
      class={`${
        mode === "horizontal" ? "flex-col" : "flex-row"
      } flex h-full w-full`}
    >
      <div
        class={`flex h-full${
          mode === "horizontal" ? "w-full flex-row" : "w-1/4 flex-col"
        }`}
      >
        <For each={tabs()}>
          {(tab, index) => (
            <div
              class={`${
                index() === activeTab()
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              } px-3 py-2 text-sm font-medium cursor-pointer`}
              onClick={() => setActiveTab(index)}
            >
              {tab.name}
            </div>
          )}
        </For>
      </div>
      <div
        class={`flex-1 h-500 ${
          mode === "horizontal"
            ? "w-full overflow-x-auto"
            : "w-3/4 overflow-y-auto"
        }`}
      >
        {tabs()[activeTab()].content}
      </div>
    </div>
  );
}
