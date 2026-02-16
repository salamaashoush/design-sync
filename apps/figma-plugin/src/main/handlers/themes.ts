import type { ThemesConfig, TokenTheme } from "../../shared/types";
import { server } from "../server";
import { themesService } from "../services/themes";
import { syncService } from "../services/sync";

export function setupThemesHandlers() {
  server.handle("themes/get", async () => {
    const tokens = await syncService.loadTokens();
    if (!tokens) {
      return { themes: [] };
    }
    return themesService.loadThemes(tokens as Record<string, unknown>);
  });

  server.handle("themes/save", async (config: ThemesConfig) => {
    await themesService.saveThemes(config);
  });

  server.handle("themes/apply", async (theme: TokenTheme) => {
    return themesService.applyTheme(theme);
  });

  server.handle("sets/list", async () => {
    // Ensure themes are loaded first
    const tokens = await syncService.loadTokens();
    if (tokens) {
      await themesService.loadThemes(tokens as Record<string, unknown>);
    }
    return themesService.getTokenSets().map(({ name, enabled }) => ({ name, enabled }));
  });
}
