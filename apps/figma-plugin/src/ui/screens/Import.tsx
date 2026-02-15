import { Button, Toast, EmptyState } from "@design-sync/uikit";
import { createSignal, Show } from "solid-js";
import { useRpcMutation } from "../hooks/useRpc";
import { DiffPreview } from "../components/DiffPreview";
import type { DiffResult } from "../../shared/types";

export function Import() {
  const [preview, setPreview] = createSignal<DiffResult | null>(null);
  const [toastMsg, setToastMsg] = createSignal<string | null>(null);

  const pullMutation = useRpcMutation("sync/pull-preview");
  const applyMutation = useRpcMutation("sync/apply");

  const handleCheck = async () => {
    const result = await pullMutation.mutate();
    setPreview(result ?? null);
  };

  const handleApply = async () => {
    const result = await applyMutation.mutate();
    setPreview(null);
    setToastMsg(`${result?.applied ?? 0} variables updated`);
    setTimeout(() => setToastMsg(null), 3000);
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
          <DiffPreview entries={preview()!} title="Incoming Changes" />
          <div style={{ display: "flex", gap: "8px" }}>
            <Button intent="secondary" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={applyMutation.loading()}>
              {applyMutation.loading() ? "Applying..." : "Apply"}
            </Button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
