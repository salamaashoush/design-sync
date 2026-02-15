import { createSignal } from 'solid-js';
import type { RemoteStorage, RemoteStorageWithoutId } from '../../shared/types';
import { useRpcQuery, useRpcMutation } from './useRpc';

export function useRemoteStorages() {
  const [storages, { refetch }] = useRpcQuery('remoteStorages/all');
  const [activeStorage, { refetch: refetchActive }] = useRpcQuery('remoteStorages/getActive');

  const addMutation = useRpcMutation('remoteStorages/add');
  const removeMutation = useRpcMutation('remoteStorages/remove');
  const activateMutation = useRpcMutation('remoteStorages/activate');
  const updateMutation = useRpcMutation('remoteStorages/update');

  async function addStorage(storage: RemoteStorageWithoutId) {
    await addMutation.mutate(storage);
    refetch();
  }

  async function removeStorage(id: string) {
    await removeMutation.mutate(id);
    refetch();
  }

  async function activateStorage(id: string) {
    await activateMutation.mutate(id);
    refetchActive();
  }

  async function updateStorage(storage: RemoteStorage) {
    await updateMutation.mutate(storage);
    refetch();
  }

  return {
    storages,
    activeStorage,
    addStorage,
    removeStorage,
    activateStorage,
    updateStorage,
    refetch,
  };
}
