import { Button, Input, Select, Spinner, type SelectItem } from "@design-sync/uikit";
import { createSignal, Show } from "solid-js";
import { useRpcMutation, useRpcQuery } from "../hooks/useRpc";

interface BranchPickerProps {
  value?: string;
  onChange: (branch: string) => void;
}

export function BranchPicker(props: BranchPickerProps) {
  const [branches, { refetch }] = useRpcQuery("branches/list");
  const createMutation = useRpcMutation("branches/create");
  const switchMutation = useRpcMutation("branches/switch");
  const [showCreate, setShowCreate] = createSignal(false);
  const [newBranchName, setNewBranchName] = createSignal("");

  const options = (): SelectItem[] => {
    const list = branches() ?? [];
    return list.map((b) => ({ value: b, label: b }));
  };

  const selectedOption = (): SelectItem | undefined => {
    if (!props.value) return undefined;
    return { value: props.value, label: props.value };
  };

  const handleChange = async (item: SelectItem) => {
    await switchMutation.mutate(item.value);
    props.onChange(item.value);
  };

  const handleCreate = async () => {
    const name = newBranchName().trim();
    if (!name) return;
    await createMutation.mutate({ name });
    await switchMutation.mutate(name);
    setNewBranchName("");
    setShowCreate(false);
    refetch();
    props.onChange(name);
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
      <Show when={branches()} fallback={<Spinner size="sm" />}>
        <div style={{ display: "flex", gap: "8px", "align-items": "flex-end" }}>
          <div style={{ flex: "1" }}>
            <Select
              label="Branch"
              options={options()}
              value={selectedOption()}
              onChange={handleChange}
              placeholder="Select branch"
            />
          </div>
          <Button intent="secondary" size="sm" onClick={() => setShowCreate(!showCreate())}>
            {showCreate() ? "Cancel" : "New"}
          </Button>
        </div>
      </Show>

      <Show when={showCreate()}>
        <div style={{ display: "flex", gap: "8px", "align-items": "flex-end" }}>
          <div style={{ flex: "1" }}>
            <Input
              label="New branch name"
              value={newBranchName()}
              onInput={(e) => setNewBranchName(e.currentTarget.value)}
              placeholder="feature/token-update"
            />
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={createMutation.loading() || !newBranchName().trim()}
          >
            {createMutation.loading() ? "Creating..." : "Create"}
          </Button>
        </div>
      </Show>
    </div>
  );
}
