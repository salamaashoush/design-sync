import {
  createSignal,
  For,
  JSXElement,
  ComponentProps,
  mergeProps,
} from "solid-js";

interface Tab {
  name: string;
  content: JSXElement;
}

interface TabsProps {
  tabs: Tab[];
  mode?: "horizontal" | "vertical";
  activeTab?: number;
}
export function Tabs(props: TabsProps) {
  const merged = mergeProps({ activeTab: 0, mode: "horizontal" }, props);
  const [activeTab, setActiveTab] = createSignal(merged.activeTab);

  return (
    <div
      classList={{
        "flex-col": merged.mode === "horizontal",
        "flex-row": merged.mode === "vertical",
      }}
      class="flex h-full w-full"
    >
      <div
        classList={{
          "w-full flex-row": merged.mode === "horizontal",
          "w-1/4 flex-col": merged.mode === "vertical",
        }}
        class="flex h-full"
      >
        <For each={merged.tabs}>
          {(tab, index) => (
            <div
              classList={{
                "bg-gray-100 text-gray-900": index() === activeTab(),
                "text-gray-500 hover:text-gray-700 hover:bg-gray-100":
                  index() !== activeTab(),
              }}
              class="px-3 py-2 text-sm font-medium cursor-pointer"
              onClick={() => setActiveTab(index())}
            >
              {tab.name}
            </div>
          )}
        </For>
      </div>
      <div
        class="flex-1 h-500"
        classList={{
          "w-full overflow-x-auto": merged.mode === "horizontal",
          "w-3/4 overflow-y-auto": merged.mode === "vertical",
        }}
      >
        {merged.tabs[activeTab()].content}
      </div>
    </div>
  );
}
