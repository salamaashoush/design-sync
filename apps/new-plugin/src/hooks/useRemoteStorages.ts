import { useRpcMutation, useRpcQuery } from './useRpcCall';

export function useRemoteStorages() {
  const { data: remoteStorages, refetch } = useRpcQuery('remoteStorages/all');
  const { data: activeRemoteStorage, refetch: refetchActive } = useRpcQuery('remoteStorages/getActive');

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
      refetchActive();
    },
  });

  const { mutateAsync: updateRemoteStorage } = useRpcMutation('remoteStorages/update', {
    onSuccess: () => {
      refetch();
    },
  });

  return {
    activeRemoteStorage,
    updateRemoteStorage,
    remoteStorages,
    addRemoteStorage,
    removeRemoteStorage,
    activateRemoteStorage,
  };
}
