import { Button, Toast, EmptyState } from "@design-sync/uikit";
import { createSignal, Show } from "solid-js";
import { useRpcMutation } from "../hooks/useRpc";
import { SelectableDiffPreview } from "../components/SelectableDiffPreview";
import type { DiffResult } from "../../shared/types";

export function Import() {
  const [preview, setPreview] = createSignal<DiffResult | null>(null);
  const [toastMsg, setToastMsg] = createSignal<string | null>(null);
  const [selectedPaths, setSelectedPaths] = createSignal<Set<string>>(new Set());

  const pullMutation = useRpcMutation("sync/pull-preview");
  const applyMutation = useRpcMutation("sync/apply");

  const handleCheck = async () => {
    const result = await pullMutation.mutate();
    setPreview(result ?? null);
    // Select all by default
    if (result) {
      setSelectedPaths(new Set(result.map((e) => e.path)));
    }
  };

  const handleApply = async () => {
    const paths = [...selectedPaths()];
    const result = await applyMutation.mutate(
      paths.length > 0 ? { selectedPaths: paths } : undefined,
    );
    setPreview(null);
    setToastMsg(`${result?.created ?? 0} created, ${result?.updated ?? 0} updated`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggle = (path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleToggleAll = (selected: boolean) => {
    if (selected) {
      setSelectedPaths(new Set((preview() ?? []).map((e) => e.path)));
    } else {
      setSelectedPaths(new Set());
    }
  };

  return (
    <div style={{ padding: "12px", display: "flex", "flex-direction": "column", gap: "12px" }}>
      <Show when={toastMsg()}>
        <Toast message={toastMsg()!} intent="success" onClose={() => setToastMsg(null)} />
      </Show>

      <Show when={!preview()}>
        <EmptyState
          title="Import Tokens"
          description="Check for updates from your remote repository"
          action={
            <Button onClick={handleCheck} disabled={pullMutation.loading()}>
              {pullMutation.loading() ? "Checking..." : "Check for Updates"}
            </Button>
          }
        />
      </Show>

      <Show when={preview()}>
        <Show
          when={preview()!.length > 0}
          fallback={
            <EmptyState
              title="Up to date"
              description="No changes to import"
              action={
                <Button intent="secondary" onClick={() => setPreview(null)}>
                  Dismiss
                </Button>
              }
            />
          }
        >
          <SelectableDiffPreview
            entries={preview()!}
            title="Incoming Changes"
            selectedPaths={selectedPaths()}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <Button intent="secondary" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={applyMutation.loading() || selectedPaths().size === 0}
            >
              {applyMutation.loading() ? "Applying..." : `Apply (${selectedPaths().size})`}
            </Button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
