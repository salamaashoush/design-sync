import type { UIVraibleCollection } from '../../shared/calls';
import { server } from '../server';
import { variablesService } from '../services/variables';

export function setupVariablesHandlers() {
  server.handle('variables/get', async () => {
    const collections = variablesService.getLocalCollections();
    const libraryCollections = await variablesService.getLibraryCollections();
    return {
      local: collections.map((c) => ({ id: c.id, name: c.name, type: 'local' }) as UIVraibleCollection),
      library: libraryCollections.map((c) => ({ id: c.key, name: c.name, type: 'library' }) as UIVraibleCollection),
    };
  });
}
