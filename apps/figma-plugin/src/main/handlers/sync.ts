import type { ExportPreviewParams, PushParams } from "../../shared/calls";
import { server } from "../server";
import { stylesService } from "../services/styles";
import { syncService } from "../services/sync";
import { variablesService } from "../services/variables";

export function setupSyncHandlers() {
  server.handle("sync/export-preview", async (params: ExportPreviewParams) => {
    const { collections, exportStyles } = params;
    return syncService.getExportPreview(collections, exportStyles);
  });

  server.handle("sync/push", async (params: PushParams) => {
    const { collections, exportStyles, commitMessage } = params;

    // Generate tokens from selected collections and styles
    const tokens: Record<string, any> = {};

    if (collections.length > 0) {
      const exported = await variablesService.exportToDesignTokens(collections, true);
      for (const file of exported) {
        Object.assign(tokens, file.tokens);
      }
    }

    if (exportStyles.typography) {
      Object.assign(tokens, { typography: stylesService.textStylesToDesignTokens() });
    }
    if (exportStyles.shadows) {
      Object.assign(tokens, { shadows: stylesService.shadowStylesToDesignTokens() });
    }
    if (exportStyles.paints) {
      const { colors, gradients } = stylesService.paintStylesToDesignTokens();
      Object.assign(tokens, { colors, gradients });
    }

    await syncService.saveTokens(tokens, commitMessage);
  });

  server.handle("sync/pull-preview", async () => {
    return syncService.getImportPreview();
  });

  server.handle("sync/apply", async () => {
    const remoteTokens = await syncService.loadTokens();
    if (!remoteTokens) {
      return { applied: 0 };
    }
    await variablesService.import(remoteTokens as Record<string, unknown>);
    // Count the number of tokens applied
    const collections = variablesService.getLocalCollections();
    let applied = 0;
    for (const collection of collections) {
      applied += collection.variableIds.length;
    }
    return { applied };
  });
}
