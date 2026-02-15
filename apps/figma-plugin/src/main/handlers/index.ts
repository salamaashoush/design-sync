import { server } from '../server';
import { syncService } from '../services/sync';
import { setupStorageHandlers } from './storage';
import { setupStylesHandlers } from './styles';
import { setupSyncHandlers } from './sync';
import { setupVariablesHandlers } from './variables';

export function setupHandlers() {
  // init handler
  server.handle('init', async () => syncService.init());

  // resize handler
  server.handle('resize', async (windowSize: { width: number; height: number }) => {
    const { width, height } = windowSize;
    figma.ui.resize(width, height);
  });

  // domain-specific handlers
  setupVariablesHandlers();
  setupStylesHandlers();
  setupSyncHandlers();
  setupStorageHandlers();
}
