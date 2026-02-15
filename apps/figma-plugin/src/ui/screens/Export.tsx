import { Button, Checkbox, Input, Spinner, Toast, EmptyState } from "@design-sync/uikit";
import { createSignal, For, Show } from "solid-js";
import { useRpcQuery, useRpcMutation } from "../hooks/useRpc";
import { DiffPreview } from "../components/DiffPreview";
import type { DiffResult } from "../../shared/types";

export function Export() {
  const [collections, { refetch: _refetch }] = useRpcQuery("variables/get");
  const [selectedIds, setSelectedIds] = createSignal<string[]>([]);
  const [exportTypography, setExportTypography] = createSignal(true);
  const [exportShadows, setExportShadows] = createSignal(true);
  const [exportPaints, setExportPaints] = createSignal(true);
  const [preview, setPreview] = createSignal<DiffResult | null>(null);
  const [commitMessage, setCommitMessage] = createSignal("Update design tokens");
  const [toastMsg, setToastMsg] = createSignal<string | null>(null);

  const previewMutation = useRpcMutation("sync/export-preview");
  const pushMutation = useRpcMutation("sync/push");

  const toggleCollection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handlePreview = async () => {
    const result = await previewMutation.mutate({
      collections: selectedIds(),
      exportStyles: {
        typography: exportTypography(),
        shadows: exportShadows(),
        paints: exportPaints(),
      },
    });
    setPreview(result ?? null);
  };

  const handlePush = async () => {
    await pushMutation.mutate({
      collections: selectedIds(),
      exportStyles: {
        typography: exportTypography(),
        shadows: exportShadows(),
        paints: exportPaints(),
      },
      commitMessage: commitMessage(),
    });
    setPreview(null);
    setToastMsg("Tokens pushed successfully");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div style={{ padding: "12px", display: "flex", "flex-direction": "column", gap: "12px" }}>
      <Show when={toastMsg()}>
        <Toast message={toastMsg()!} intent="success" onClose={() => setToastMsg(null)} />
      </Show>

      <Show when={collections()} fallback={<Spinner />}>
        <div>
          <h4 style={{ margin: "0 0 8px" }}>Variable Collections</h4>
          <Show
            when={collections()!.local.length > 0}
            fallback={
              <EmptyState
                title="No collections"
                description="Create variable collections in Figma first"
              />
            }
          >
            <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
              <For each={collections()!.local}>
                {(col) => (
                  <Checkbox
                    label={col.name}
                    checked={selectedIds().includes(col.id)}
                    onChange={() => toggleCollection(col.id)}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>

        <div>
          <h4 style={{ margin: "0 0 8px" }}>Styles</h4>
          <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
            <Checkbox
              label="Typography"
              checked={exportTypography()}
              onChange={setExportTypography}
            />
            <Checkbox label="Shadows" checked={exportShadows()} onChange={setExportShadows} />
            <Checkbox label="Paint Styles" checked={exportPaints()} onChange={setExportPaints} />
          </div>
        </div>

        <Show when={!preview()}>
          <Button
            onClick={handlePreview}
            disabled={
              selectedIds().length === 0 &&
              !exportTypography() &&
              !exportShadows() &&
              !exportPaints()
            }
          >
            {previewMutation.loading() ? "Generating..." : "Preview"}
          </Button>
        </Show>

        <Show when={preview()}>
          <DiffPreview entries={preview()!} title="Export Preview" />
          <Input
            label="Commit Message"
            value={commitMessage()}
            onInput={(e) => setCommitMessage(e.currentTarget.value)}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <Button intent="secondary" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button onClick={handlePush} disabled={pushMutation.loading()}>
              {pushMutation.loading() ? "Pushing..." : "Push"}
            </Button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
