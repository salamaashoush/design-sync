import { Button, Input, Toast } from "@design-sync/uikit";
import { createSignal, Show } from "solid-js";
import { useRpcMutation } from "../hooks/useRpc";

interface TokenEditorProps {
  path: string;
  token: Record<string, unknown>;
  onSaved?: () => void;
}

export function TokenEditor(props: TokenEditorProps) {
  const updateMutation = useRpcMutation("tokens/update");
  const deleteMutation = useRpcMutation("tokens/delete");
  const [toastMsg, setToastMsg] = createSignal<string | null>(null);

  const tokenType = () => (props.token.$type as string) ?? "unknown";
  const tokenValue = () => {
    const val = props.token.$value;
    return typeof val === "object" ? JSON.stringify(val, null, 2) : String(val ?? "");
  };
  const tokenDescription = () => (props.token.$description as string) ?? "";

  const [editValue, setEditValue] = createSignal(tokenValue());
  const [editDescription, setEditDescription] = createSignal(tokenDescription());

  // Reset when props change
  const resetForm = () => {
    setEditValue(tokenValue());
    setEditDescription(tokenDescription());
  };

  const handleSave = async () => {
    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(editValue());
    } catch {
      parsedValue = editValue();
    }

    const updatedToken = {
      ...props.token,
      $value: parsedValue,
      $description: editDescription() || undefined,
    };

    await updateMutation.mutate({ path: props.path, token: updatedToken });
    setToastMsg("Token saved");
    setTimeout(() => setToastMsg(null), 2000);
    props.onSaved?.();
  };

  const handleDelete = async () => {
    await deleteMutation.mutate(props.path);
    setToastMsg("Token deleted");
    setTimeout(() => setToastMsg(null), 2000);
    props.onSaved?.();
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px", padding: "8px" }}>
      <Show when={toastMsg()}>
        <Toast message={toastMsg()!} intent="success" onClose={() => setToastMsg(null)} />
      </Show>

      <div style={{ "font-size": "12px", "font-weight": "600" }}>{props.path}</div>
      <div style={{ "font-size": "11px", color: "var(--figma-color-text-secondary)" }}>
        Type: {tokenType()}
      </div>

      <Show when={tokenType() === "color"}>
        <div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
          <input
            type="color"
            value={String(editValue()).startsWith("#") ? editValue().slice(0, 7) : "#000000"}
            onInput={(e) => setEditValue(e.currentTarget.value)}
            style={{ width: "32px", height: "32px", border: "none", padding: "0" }}
          />
          <div style={{ flex: "1" }}>
            <Input
              label="Value"
              value={editValue()}
              onInput={(e) => setEditValue(e.currentTarget.value)}
            />
          </div>
        </div>
      </Show>

      <Show when={tokenType() !== "color"}>
        <Show
          when={typeof props.token.$value === "object"}
          fallback={
            <Input
              label="Value"
              value={editValue()}
              onInput={(e) => setEditValue(e.currentTarget.value)}
            />
          }
        >
          <div>
            <div style={{ "font-size": "11px", "margin-bottom": "4px" }}>Value (JSON)</div>
            <textarea
              style={{
                width: "100%",
                "min-height": "80px",
                "font-family": "monospace",
                "font-size": "11px",
                padding: "4px",
                border: "1px solid var(--figma-color-border)",
                "border-radius": "4px",
                resize: "vertical",
              }}
              value={editValue()}
              onInput={(e) => setEditValue(e.currentTarget.value)}
            />
          </div>
        </Show>
      </Show>

      <Input
        label="Description"
        value={editDescription()}
        onInput={(e) => setEditDescription(e.currentTarget.value)}
        placeholder="Optional description"
      />

      <div style={{ display: "flex", gap: "8px" }}>
        <Button onClick={handleSave} disabled={updateMutation.loading()}>
          {updateMutation.loading() ? "Saving..." : "Save"}
        </Button>
        <Button intent="secondary" onClick={resetForm}>
          Reset
        </Button>
        <Button intent="danger" onClick={handleDelete} disabled={deleteMutation.loading()}>
          Delete
        </Button>
      </div>
    </div>
  );
}
