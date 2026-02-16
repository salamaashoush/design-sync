import type { PullRequestOptions } from "@design-sync/storage";
import { get, set } from "@design-sync/utils";
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

  server.handle("sync/apply", async (params?: { selectedPaths?: string[] }) => {
    const remoteTokens = await syncService.loadTokens();
    if (!remoteTokens) {
      return { created: 0, updated: 0 };
    }
    let tokens = remoteTokens as Record<string, unknown>;

    // Filter tokens if selectedPaths are specified
    if (params?.selectedPaths && params.selectedPaths.length > 0) {
      const selectedSet = new Set(params.selectedPaths);
      const filtered: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(tokens)) {
        if (key.startsWith("$") || selectedSet.has(key)) {
          filtered[key] = value;
        }
      }
      tokens = filtered;
    }

    // Import variables
    const vars = await variablesService.import(tokens);

    // Import styles (typography, shadows, paints)
    const typo = await stylesService.importTypography(tokens);
    const shadows = await stylesService.importShadows(tokens);
    const paints = await stylesService.importPaints(tokens);

    return {
      created: vars.created + typo.created + shadows.created + paints.created,
      updated: vars.updated + typo.updated + shadows.updated + paints.updated,
    };
  });

  // Branch management
  server.handle("branches/list", async () => {
    return syncService.listBranches();
  });

  server.handle("branches/create", async (params: { name: string; fromRef?: string }) => {
    await syncService.createBranch(params.name, params.fromRef);
  });

  server.handle("branches/switch", async (branch: string) => {
    await syncService.switchBranch(branch);
  });

  // Pull request creation
  server.handle("sync/create-pr", async (params: PullRequestOptions) => {
    return syncService.createPullRequest(params);
  });

  // Token editing
  server.handle("tokens/tree", async () => {
    const tokens = await syncService.loadTokens();
    return (tokens as Record<string, unknown>) ?? {};
  });

  server.handle("tokens/get", async (path: string) => {
    const tokens = await syncService.loadTokens();
    if (!tokens) return null;
    const token = get(tokens as Record<string, unknown>, path);
    if (!token) return null;
    return { path, token: token as Record<string, unknown> };
  });

  server.handle(
    "tokens/update",
    async (params: { path: string; token: Record<string, unknown> }) => {
      const tokens = await syncService.loadTokens();
      if (!tokens) throw new Error("No tokens loaded");
      set(tokens as Record<string, unknown>, params.path, params.token);
      await syncService.saveTokens(tokens);
    },
  );

  server.handle(
    "tokens/create",
    async (params: { path: string; token: Record<string, unknown> }) => {
      const tokens = await syncService.loadTokens();
      if (!tokens) throw new Error("No tokens loaded");
      set(tokens as Record<string, unknown>, params.path, params.token);
      await syncService.saveTokens(tokens);
    },
  );

  server.handle("tokens/delete", async (path: string) => {
    const tokens = await syncService.loadTokens();
    if (!tokens) throw new Error("No tokens loaded");
    // Navigate to parent and delete the key
    const parts = path.split(".");
    const key = parts.pop()!;
    const parent =
      parts.length > 0 ? get(tokens as Record<string, unknown>, parts.join(".")) : tokens;
    if (parent && typeof parent === "object") {
      delete (parent as Record<string, unknown>)[key];
    }
    await syncService.saveTokens(tokens);
  });
}
