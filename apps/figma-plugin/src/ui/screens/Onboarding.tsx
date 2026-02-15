import { useRouter } from "../router";
import { StorageForm } from "../components/StorageForm";
import { useRemoteStorages } from "../hooks/useStorages";
import type { RemoteStorageWithoutId } from "../../shared/types";

export function Onboarding() {
  const { navigate } = useRouter();
  const { addStorage } = useRemoteStorages();

  const handleAdd = async (storage: RemoteStorageWithoutId) => {
    await addStorage(storage);
    navigate("dashboard");
  };

  return (
    <div
      style={{
        padding: "32px 24px",
        display: "flex",
        "flex-direction": "column",
        gap: "24px",
        "align-items": "center",
      }}
    >
      <div style={{ "text-align": "center" }}>
        <h2 style={{ margin: "0 0 8px" }}>Welcome to DesignSync</h2>
        <p style={{ margin: 0, opacity: 0.6 }}>
          Connect a Git repository to sync your design tokens
        </p>
      </div>
      <StorageForm onSubmit={handleAdd} />
    </div>
  );
}
