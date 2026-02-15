import type { RemoteStorage, RemoteStorageWithoutId } from '../../shared/types';
import { server } from '../server';
import { syncService } from '../services/sync';

export function setupStorageHandlers() {
  server.handle('remoteStorages/all', async () => syncService.getRemoteStorages());
  server.handle('remoteStorages/add', async (storage: RemoteStorageWithoutId) => syncService.addRemoteStorage(storage));
  server.handle('remoteStorages/remove', async (storageId: string) => syncService.removeRemoteStorage(storageId));
  server.handle('remoteStorages/activate', async (storageId: string) => syncService.activateRemoteStorage(storageId));
  server.handle('remoteStorages/update', async (storage: RemoteStorage) => syncService.updateRemoteStorage(storage));
  server.handle('remoteStorages/getActive', async () => syncService.getActiveRemoteStorage());
}
