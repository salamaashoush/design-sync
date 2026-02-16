import { RadioButton } from "@design-sync/uikit";
import { createSignal, For } from "solid-js";

export interface Conflict {
  path: string;
  base: unknown;
  local: unknown;
  remote: unknown;
}

export type Resolution = "local" | "remote";

interface ConflictResolverProps {
  conflicts: Conflict[];
  onResolve: (resolutions: Record<string, Resolution>) => void;
}

export function ConflictResolver(props: ConflictResolverProps) {
  const [resolutions, setResolutions] = createSignal<Record<string, Resolution>>({});

  const setResolution = (path: string, resolution: Resolution) => {
    setResolutions((prev) => ({ ...prev, [path]: resolution }));
    // Check if all resolved
    const updated = { ...resolutions(), [path]: resolution };
    if (Object.keys(updated).length === props.conflicts.length) {
      props.onResolve(updated);
    }
  };

  const formatValue = (value: unknown) => {
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value ?? "(deleted)");
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
      <div style={{ "font-size": "12px", "font-weight": "600" }}>
        {props.conflicts.length} conflict{props.conflicts.length > 1 ? "s" : ""} to resolve
      </div>
      <For each={props.conflicts}>
        {(conflict) => (
          <div
            style={{
              padding: "8px",
              border: "1px solid var(--figma-color-border)",
              "border-radius": "4px",
              display: "flex",
              "flex-direction": "column",
              gap: "8px",
            }}
          >
            <div style={{ "font-size": "11px", "font-weight": "600" }}>{conflict.path}</div>

            <div
              style={{
                display: "grid",
                "grid-template-columns": "1fr 1fr 1fr",
                gap: "4px",
                "font-size": "10px",
              }}
            >
              <div>
                <div style={{ "font-weight": "500", "margin-bottom": "2px" }}>Base</div>
                <pre
                  style={{
                    padding: "4px",
                    background: "var(--figma-color-bg-secondary)",
                    "border-radius": "2px",
                    overflow: "auto",
                    "max-height": "60px",
                    margin: "0",
                  }}
                >
                  {formatValue(conflict.base)}
                </pre>
              </div>
              <div>
                <div style={{ "font-weight": "500", "margin-bottom": "2px" }}>Local (Figma)</div>
                <pre
                  style={{
                    padding: "4px",
                    background: "var(--figma-color-bg-secondary)",
                    "border-radius": "2px",
                    overflow: "auto",
                    "max-height": "60px",
                    margin: "0",
                  }}
                >
                  {formatValue(conflict.local)}
                </pre>
              </div>
              <div>
                <div style={{ "font-weight": "500", "margin-bottom": "2px" }}>Remote (Git)</div>
                <pre
                  style={{
                    padding: "4px",
                    background: "var(--figma-color-bg-secondary)",
                    "border-radius": "2px",
                    overflow: "auto",
                    "max-height": "60px",
                    margin: "0",
                  }}
                >
                  {formatValue(conflict.remote)}
                </pre>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <RadioButton
                label="Keep local"
                checked={resolutions()[conflict.path] === "local"}
                onChange={() => setResolution(conflict.path, "local")}
              />
              <RadioButton
                label="Keep remote"
                checked={resolutions()[conflict.path] === "remote"}
                onChange={() => setResolution(conflict.path, "remote")}
              />
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
