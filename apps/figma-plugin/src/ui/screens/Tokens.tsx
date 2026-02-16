import { EmptyState } from "@design-sync/uikit";
import { createSignal, Show } from "solid-js";
import { TokenBrowser } from "../components/TokenBrowser";
import { TokenDetail } from "../components/TokenDetail";
import { TokenEditor } from "../components/TokenEditor";

export function Tokens() {
  const [selectedPath, setSelectedPath] = createSignal<string | undefined>();
  const [selectedToken, setSelectedToken] = createSignal<Record<string, unknown> | null>(null);
  const [mode, setMode] = createSignal<"detail" | "edit">("detail");

  const handleSelect = (path: string, token: Record<string, unknown> | null) => {
    setSelectedPath(path);
    setSelectedToken(token);
    setMode("detail");
  };

  return (
    <div style={{ display: "flex", height: "100%", "min-height": "300px" }}>
      <div
        style={{
          width: "50%",
          "border-right": "1px solid var(--figma-color-border)",
          overflow: "auto",
          padding: "8px",
        }}
      >
        <TokenBrowser selectedPath={selectedPath()} onSelect={handleSelect} />
      </div>
      <div style={{ width: "50%", overflow: "auto" }}>
        <Show
          when={selectedToken()}
          fallback={
            <EmptyState
              title="Select a token"
              description="Choose a token from the tree to view details"
            />
          }
        >
          <div
            style={{
              display: "flex",
              gap: "4px",
              padding: "4px 8px",
              "border-bottom": "1px solid var(--figma-color-border)",
            }}
          >
            <button
              onClick={() => setMode("detail")}
              style={{
                padding: "2px 8px",
                "font-size": "11px",
                background: mode() === "detail" ? "var(--figma-color-bg-brand)" : "transparent",
                color:
                  mode() === "detail"
                    ? "var(--figma-color-text-onbrand)"
                    : "var(--figma-color-text)",
                border: "1px solid var(--figma-color-border)",
                "border-radius": "4px",
                cursor: "pointer",
              }}
            >
              Detail
            </button>
            <button
              onClick={() => setMode("edit")}
              style={{
                padding: "2px 8px",
                "font-size": "11px",
                background: mode() === "edit" ? "var(--figma-color-bg-brand)" : "transparent",
                color:
                  mode() === "edit" ? "var(--figma-color-text-onbrand)" : "var(--figma-color-text)",
                border: "1px solid var(--figma-color-border)",
                "border-radius": "4px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          </div>
          <Show when={mode() === "detail"}>
            <TokenDetail path={selectedPath()!} token={selectedToken()!} />
          </Show>
          <Show when={mode() === "edit"}>
            <TokenEditor path={selectedPath()!} token={selectedToken()!} />
          </Show>
        </Show>
      </div>
    </div>
  );
}
