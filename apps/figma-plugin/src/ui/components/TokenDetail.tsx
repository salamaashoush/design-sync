import { Badge, ColorSwatch } from "@design-sync/uikit";
import { For, Show } from "solid-js";

interface TokenDetailProps {
  path: string;
  token: Record<string, unknown>;
}

export function TokenDetail(props: TokenDetailProps) {
  const tokenType = () => (props.token.$type as string) ?? "unknown";
  const tokenValue = () => props.token.$value;
  const description = () => (props.token.$description as string) ?? "";
  const extensions = () => (props.token.$extensions as Record<string, unknown>) ?? {};

  const isDeprecated = () => {
    const ext = extensions();
    return ext["com.deprecated"] === true || ext["deprecated"] === true;
  };

  const modeValues = () => {
    const ext = extensions();
    const mode = ext.mode as Record<string, unknown> | undefined;
    return mode ? Object.entries(mode) : [];
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px", padding: "8px" }}>
      <div style={{ "font-size": "12px", "font-weight": "600" }}>{props.path}</div>

      <div style={{ display: "flex", gap: "4px", "align-items": "center" }}>
        <Badge>{tokenType()}</Badge>
        <Show when={isDeprecated()}>
          <Badge>deprecated</Badge>
        </Show>
      </div>

      <Show when={description()}>
        <div style={{ "font-size": "11px", color: "var(--figma-color-text-secondary)" }}>
          {description()}
        </div>
      </Show>

      <div style={{ "font-size": "11px" }}>
        <strong>Value: </strong>
        <Show
          when={tokenType() === "color" && typeof tokenValue() === "string"}
          fallback={
            <code>
              {typeof tokenValue() === "object"
                ? JSON.stringify(tokenValue(), null, 2)
                : String(tokenValue())}
            </code>
          }
        >
          <div style={{ display: "flex", gap: "4px", "align-items": "center" }}>
            <ColorSwatch color={String(tokenValue())} size="sm" />
            <code>{String(tokenValue())}</code>
          </div>
        </Show>
      </div>

      <Show when={modeValues().length > 0}>
        <div style={{ "font-size": "11px" }}>
          <strong>Mode Values:</strong>
          <div
            style={{ "margin-top": "4px", display: "flex", "flex-direction": "column", gap: "2px" }}
          >
            <For each={modeValues()}>
              {([mode, value]) => (
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ "font-weight": "500", "min-width": "60px" }}>{mode}:</span>
                  <code>{typeof value === "object" ? JSON.stringify(value) : String(value)}</code>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={Object.keys(extensions()).length > 0}>
        <div style={{ "font-size": "11px" }}>
          <strong>Extensions:</strong>
          <pre
            style={{
              "margin-top": "4px",
              padding: "4px",
              background: "var(--figma-color-bg-secondary)",
              "border-radius": "4px",
              "font-size": "10px",
              overflow: "auto",
              "max-height": "100px",
            }}
          >
            {JSON.stringify(extensions(), null, 2)}
          </pre>
        </div>
      </Show>
    </div>
  );
}
