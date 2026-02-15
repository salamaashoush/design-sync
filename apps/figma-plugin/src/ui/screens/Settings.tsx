import { Button, Badge, Dialog, EmptyState, Spinner } from '@design-sync/uikit';
import { createSignal, For, Show } from 'solid-js';
import { useRemoteStorages } from '../hooks/useStorages';
import { useRouter } from '../router';
import { StorageForm } from '../components/StorageForm';
import { StorageCard } from '../components/StorageCard';
import type { RemoteStorage, RemoteStorageWithoutId } from '../../shared/types';

export function Settings() {
  const { navigate } = useRouter();
  const { storages, activeStorage, addStorage, removeStorage, activateStorage, updateStorage, refetch } = useRemoteStorages();
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editingStorage, setEditingStorage] = createSignal<RemoteStorage | null>(null);

  const handleAdd = async (storage: RemoteStorageWithoutId) => {
    await addStorage(storage);
    setShowAddForm(false);
  };

  const handleUpdate = async (storage: RemoteStorage) => {
    await updateStorage(storage);
    setEditingStorage(null);
  };

  return (
    <div style={{ padding: '12px', display: 'flex', 'flex-direction': 'column', gap: '12px' }}>
      <div style={{ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center' }}>
        <h3 style={{ margin: 0 }}>Remote Storages</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button intent="secondary" onClick={() => navigate('dashboard')}>Back</Button>
          <Button onClick={() => setShowAddForm(true)}>Add Storage</Button>
        </div>
      </div>

      <Show when={storages()} fallback={<Spinner />}>
        <Show when={storages()!.length > 0} fallback={
          <EmptyState
            title="No storages configured"
            description="Add a remote Git repository to sync your design tokens"
            action={<Button onClick={() => setShowAddForm(true)}>Add Storage</Button>}
          />
        }>
          <div style={{ display: 'flex', 'flex-direction': 'column', gap: '8px' }}>
            <For each={storages()}>
              {(storage) => (
                <StorageCard
                  storage={storage}
                  isActive={activeStorage()?.id === storage.id}
                  onActivate={() => activateStorage(storage.id)}
                  onEdit={() => setEditingStorage(storage)}
                  onDelete={() => removeStorage(storage.id)}
                />
              )}
            </For>
          </div>
        </Show>
      </Show>

      <Dialog title="Add Remote Storage" open={showAddForm()} onOpenChange={setShowAddForm}>
        <StorageForm onSubmit={handleAdd} />
      </Dialog>

      <Dialog title="Edit Remote Storage" open={!!editingStorage()} onOpenChange={(open) => { if (!open) setEditingStorage(null); }}>
        <Show when={editingStorage()}>
          <StorageForm storage={editingStorage()!} onSubmit={(s) => handleUpdate({ ...s, id: editingStorage()!.id } as RemoteStorage)} />
        </Show>
      </Dialog>
    </div>
  );
}
