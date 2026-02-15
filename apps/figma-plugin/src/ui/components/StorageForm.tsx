import { Button, Input } from "@design-sync/uikit";
import { createSignal, Show } from "solid-js";
import type { RemoteStorage, RemoteStorageWithoutId } from "../../shared/types";

interface StorageFormProps {
  storage?: RemoteStorage;
  onSubmit: (storage: RemoteStorageWithoutId) => void;
}

export function StorageForm(props: StorageFormProps) {
  const [name, setName] = createSignal(props.storage?.name ?? "");
  const [uri, setUri] = createSignal(props.storage?.uri ?? "");
  const [accessToken, setAccessToken] = createSignal(props.storage?.accessToken ?? "");
  const [apiUrl, setApiUrl] = createSignal(props.storage?.apiUrl ?? "");
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!name() || !uri() || !accessToken()) {
      setError("Name, URI, and Access Token are required");
      return;
    }
    setError(null);
    props.onSubmit({
      name: name(),
      uri: uri(),
      accessToken: accessToken(),
      apiUrl: apiUrl() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", "flex-direction": "column", gap: "12px", width: "100%" }}
    >
      <Input
        label="Name"
        placeholder="My Project Tokens"
        value={name()}
        onInput={(e) => setName(e.currentTarget.value)}
      />
      <Input
        label="Repository URI"
        placeholder="github:owner/repo#branch/path"
        value={uri()}
        onInput={(e) => setUri(e.currentTarget.value)}
        description="Format: provider:owner/repo#ref/path"
      />
      <Input
        label="Access Token"
        placeholder="ghp_xxxx..."
        value={accessToken()}
        onInput={(e) => setAccessToken(e.currentTarget.value)}
        type="password"
      />
      <Input
        label="API URL (optional)"
        placeholder="https://api.github.com"
        value={apiUrl()}
        onInput={(e) => setApiUrl(e.currentTarget.value)}
        description="Only needed for self-hosted instances"
      />
      <Show when={error()}>
        <p
          style={{
            color: "var(--figma-color-text-danger, #dc3412)",
            "font-size": "11px",
            margin: 0,
          }}
        >
          {error()}
        </p>
      </Show>
      <Button type="submit">{props.storage ? "Update" : "Add Storage"}</Button>
    </form>
  );
}
