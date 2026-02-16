import { Checkbox, DiffView } from "@design-sync/uikit";
import { For, Show } from "solid-js";
import type { DiffEntry } from "../../shared/types";

interface SelectableDiffPreviewProps {
  entries: DiffEntry[];
  title?: string;
  selectedPaths: Set<string>;
  onToggle: (path: string) => void;
  onToggleAll: (selected: boolean) => void;
}

export function SelectableDiffPreview(props: SelectableDiffPreviewProps) {
  const allSelected = () => props.entries.every((e) => props.selectedPaths.has(e.path));
  const someSelected = () => props.entries.some((e) => props.selectedPaths.has(e.path));

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
      <Show when={props.title}>
        <div style={{ "font-size": "12px", "font-weight": "600" }}>{props.title}</div>
      </Show>

      <Checkbox
        label={allSelected() ? "Deselect all" : "Select all"}
        checked={allSelected()}
        indeterminate={someSelected() && !allSelected()}
        onChange={() => props.onToggleAll(!allSelected())}
      />

      <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
        <For each={props.entries}>
          {(entry) => (
            <div style={{ display: "flex", gap: "4px", "align-items": "flex-start" }}>
              <div style={{ "padding-top": "2px" }}>
                <Checkbox
                  label=""
                  checked={props.selectedPaths.has(entry.path)}
                  onChange={() => props.onToggle(entry.path)}
                />
              </div>
              <div
                style={{ flex: "1", opacity: props.selectedPaths.has(entry.path) ? "1" : "0.5" }}
              >
                <DiffView entries={[entry]} />
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
