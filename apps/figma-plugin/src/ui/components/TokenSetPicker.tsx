import { Checkbox, Spinner } from "@design-sync/uikit";
import { For, Show } from "solid-js";
import { useRpcQuery } from "../hooks/useRpc";

interface TokenSetPickerProps {
  selectedSets: string[];
  onToggle: (name: string) => void;
}

export function TokenSetPicker(props: TokenSetPickerProps) {
  const [sets] = useRpcQuery("sets/list");

  return (
    <Show when={sets()} fallback={<Spinner size="sm" />}>
      <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
        <For each={sets()}>
          {(set) => (
            <Checkbox
              label={set.name}
              checked={props.selectedSets.includes(set.name)}
              onChange={() => props.onToggle(set.name)}
            />
          )}
        </For>
      </div>
    </Show>
  );
}
