import { RpcServer } from '@design-sync/rpc';
import { paintStylesToDesignTokens, shadowStylesToDesignTokens, textStylesToDesignTokens } from '../plugin/styles';
import { syncService } from '../plugin/syncService';
import { variablesService } from '../plugin/variablesService';
import { RemoteStorage, RemoteStorageWithoutId } from '../types';
import { UIVraibleCollection } from './calls';

export const server = new RpcServer({
  addEventListener: figma.ui.on,
  removeEventListener: figma.ui.off,
  postMessage: (message) =>
    figma.ui.postMessage(message, {
      origin: '*',
    }),
});

export function setupRpcServerHandlers() {
  server.handle('init', async () => syncService.init());
  server.handle('resize', async (windowSize: { width: number; height: number }) => {
    const { width, height } = windowSize;
    figma.ui.resize(width, height);
  });

  server.handle('variables/get', async () => {
    const collections = variablesService.getLocalCollections();
    const libraryCollections = await variablesService.getLibraryCollections();
    return {
      local: collections.map((c) => ({ id: c.id, name: c.name, type: 'local' }) as UIVraibleCollection),
      library: libraryCollections.map((c) => ({ id: c.key, name: c.name, type: 'library' }) as UIVraibleCollection),
    };
  });

  server.handle('styles/get', async () => {
    const typography = figma.getLocalTextStyles().map((s) => ({
      id: s.id,
      name: s.name,
    }));
    const shadows = figma.getLocalEffectStyles().flatMap((s) =>
      s.effects
        .filter((e) => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
        .map((e) => ({
          id: s.id,
          name: s.name,
        })),
    );

    const gradients = figma.getLocalPaintStyles().flatMap((s) =>
      s.paints
        .filter((p) => p.type.includes('GRADIENT'))
        .map(() => ({
          id: s.id,
          name: s.name,
        })),
    );

    return {
      typography,
      shadows,
      gradients,
    };
  });

  // server.handle('variables/export', async (collectionIds: string[]) => {
  //   const collections = await varaiblesService.exportToDesignTokens(collectionIds);
  //   const styles = textStylesToDesignTokens();
  //   const shadows = shadowStylesToDesignTokens();
  //   const gradients = paintStylesToDesignTokens();
  //   console.log('exported collections', {
  //     collections,
  //     styles,
  //     shadows,
  //     gradients,
  //   });
  // });
  server.handle('tokens/sync', async ({ collections, exportPaints, exportShadows, exportTypography }) => {
    const tokens = {
      styles: {
        ...(exportPaints ? paintStylesToDesignTokens() : {}),
        typography: exportTypography ? textStylesToDesignTokens() : {},
        shadows: exportShadows ? shadowStylesToDesignTokens() : {},
      },
      collections: collections.length > 0 ? await variablesService.exportToDesignTokens(collections, true) : [],
    };
    await syncService.loadTokens();
    // await syncService.saveTokens(tokens);
    console.log('exported collections', tokens);
  });

  server.handle('remoteStorages/all', async () => syncService.getRemoteStorages());
  server.handle('remoteStorages/add', async (storage: RemoteStorageWithoutId) => syncService.addRemoteStorage(storage));
  server.handle('remoteStorages/remove', async (storageId: string) => syncService.removeRemoteStorage(storageId));
  server.handle('remoteStorages/activate', async (storageId: string) => syncService.activateRemoteStorage(storageId));
  server.handle('remoteStorages/update', async (storage: RemoteStorage) => syncService.updateRemoteStorage(storage));
  server.handle('remoteStorages/getActive', async () => syncService.getActiveRemoteStorage());
}
