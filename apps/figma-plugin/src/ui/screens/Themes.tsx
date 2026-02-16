import { Button, Checkbox, Input, Spinner, Toast, EmptyState } from "@design-sync/uikit";
import { createSignal, For, Show } from "solid-js";
import type { TokenSetRef, TokenTheme } from "../../shared/types";
import { useRpcMutation, useRpcQuery } from "../hooks/useRpc";

export function Themes() {
  const [themesConfig, { refetch }] = useRpcQuery("themes/get");
  const [sets] = useRpcQuery("sets/list");
  const saveMutation = useRpcMutation("themes/save");
  const applyMutation = useRpcMutation("themes/apply");
  const [toastMsg, setToastMsg] = createSignal<string | null>(null);
  const [editing, setEditing] = createSignal<TokenTheme | null>(null);
  const [editName, setEditName] = createSignal("");
  const [editSets, setEditSets] = createSignal<TokenSetRef[]>([]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleNewTheme = () => {
    const availableSets = sets() ?? [];
    setEditName("New Theme");
    setEditSets(availableSets.map((s) => ({ name: s.name, enabled: true })));
    setEditing({
      name: "New Theme",
      sets: availableSets.map((s) => ({ name: s.name, enabled: true })),
    });
  };

  const handleEditTheme = (theme: TokenTheme) => {
    const availableSets = sets() ?? [];
    setEditName(theme.name);
    // Ensure all available sets are represented
    const themeSets = availableSets.map((s) => {
      const existing = theme.sets.find((ts) => ts.name === s.name);
      return existing ?? { name: s.name, enabled: false };
    });
    setEditSets(themeSets);
    setEditing(theme);
  };

  const handleSaveTheme = async () => {
    const config = themesConfig();
    if (!config) return;

    const theme: TokenTheme = { name: editName(), sets: editSets() };
    const existingIndex = config.themes.findIndex((t) => t.name === editing()?.name);

    const updatedThemes =
      existingIndex >= 0
        ? config.themes.map((t, i) => (i === existingIndex ? theme : t))
        : [...config.themes, theme];

    await saveMutation.mutate({ themes: updatedThemes });
    setEditing(null);
    refetch();
    showToast("Theme saved");
  };

  const handleDeleteTheme = async (themeName: string) => {
    const config = themesConfig();
    if (!config) return;
    await saveMutation.mutate({
      themes: config.themes.filter((t) => t.name !== themeName),
    });
    refetch();
    showToast("Theme deleted");
  };

  const handleApply = async (theme: TokenTheme) => {
    const result = await applyMutation.mutate(theme);
    showToast(`Applied: ${result?.created ?? 0} created, ${result?.updated ?? 0} updated`);
  };

  const toggleSet = (setName: string) => {
    setEditSets((prev) =>
      prev.map((s) => (s.name === setName ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  return (
    <div style={{ padding: "12px", display: "flex", "flex-direction": "column", gap: "12px" }}>
      <Show when={toastMsg()}>
        <Toast message={toastMsg()!} intent="success" onClose={() => setToastMsg(null)} />
      </Show>

      <Show when={themesConfig()} fallback={<Spinner size="sm" />}>
        <Show when={!editing()}>
          <Show
            when={themesConfig()!.themes.length > 0}
            fallback={
              <EmptyState
                title="No Themes"
                description="Create themes to manage token set combinations"
                action={<Button onClick={handleNewTheme}>Create Theme</Button>}
              />
            }
          >
            <For each={themesConfig()!.themes}>
              {(theme) => (
                <div
                  style={{
                    padding: "8px",
                    border: "1px solid var(--figma-color-border)",
                    "border-radius": "4px",
                    display: "flex",
                    "flex-direction": "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      "justify-content": "space-between",
                      "align-items": "center",
                    }}
                  >
                    <strong>{theme.name}</strong>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <Button
                        size="sm"
                        onClick={() => handleApply(theme)}
                        disabled={applyMutation.loading()}
                      >
                        Apply
                      </Button>
                      <Button size="sm" intent="secondary" onClick={() => handleEditTheme(theme)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        intent="danger"
                        onClick={() => handleDeleteTheme(theme.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div style={{ "font-size": "11px", color: "var(--figma-color-text-secondary)" }}>
                    {theme.sets
                      .filter((s) => s.enabled)
                      .map((s) => s.name)
                      .join(", ")}
                  </div>
                </div>
              )}
            </For>
            <Button intent="secondary" onClick={handleNewTheme}>
              Add Theme
            </Button>
          </Show>
        </Show>

        <Show when={editing()}>
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
            <Input
              label="Theme name"
              value={editName()}
              onInput={(e) => setEditName(e.currentTarget.value)}
            />
            <div style={{ "font-size": "12px", "font-weight": "600" }}>Token Sets</div>
            <For each={editSets()}>
              {(set) => (
                <Checkbox
                  label={set.name}
                  checked={set.enabled}
                  onChange={() => toggleSet(set.name)}
                />
              )}
            </For>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button intent="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTheme} disabled={saveMutation.loading()}>
                Save Theme
              </Button>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}
