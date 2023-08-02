import { useMemo } from 'preact/hooks';
import { useRpcMutation, useRpcQuery } from './useRpcCall';

export function useRemoteStorages() {
  const { data, refetch } = useRpcQuery('remoteStorages/get');
  const { mutateAsync: addRemoteStorage } = useRpcMutation('remoteStorages/add', {
    onSuccess: () => {
      refetch();
    },
  });
  const { mutateAsync: removeRemoteStorage } = useRpcMutation('remoteStorages/remove', {
    onSuccess: () => {
      refetch();
    },
  });

  const { mutateAsync: activateRemoteStorage } = useRpcMutation('remoteStorages/activate', {
    onSuccess: () => {
      refetch();
    },
  });

  const activeRemoteStorage = useMemo(() => data?.find((storage) => storage.active), [data]);

  return {
    activeRemoteStorage,
    remoteStorages: data,
    addRemoteStorage,
    removeRemoteStorage,
    activateRemoteStorage,
  };
}
