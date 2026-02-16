import { isObject } from "@design-sync/utils";
import type { ThemesConfig, TokenSet, TokenSetRef, TokenTheme } from "../../shared/types";
import { localStorage } from "./storage";
import { variablesService } from "./variables";
import { stylesService } from "./styles";

export class ThemesService {
  private themes: ThemesConfig = { themes: [] };
  private tokenSets: Map<string, TokenSet> = new Map();

  async loadThemes(tokens: Record<string, unknown>): Promise<ThemesConfig> {
    // Check for $themes key in tokens or load from separate storage
    const themesData = tokens["$themes"] as TokenTheme[] | undefined;
    if (Array.isArray(themesData)) {
      this.themes = { themes: themesData };
    } else {
      // Try loading from local storage
      const stored = await localStorage.get<ThemesConfig>("themesConfig");
      if (stored) {
        this.themes = stored;
      }
    }

    // Parse token sets from top-level keys (excluding $ keys)
    this.tokenSets.clear();
    for (const [key, value] of Object.entries(tokens)) {
      if (key.startsWith("$")) continue;
      if (isObject(value)) {
        this.tokenSets.set(key, {
          name: key,
          tokens: value as Record<string, unknown>,
          enabled: true,
        });
      }
    }

    return this.themes;
  }

  async saveThemes(config: ThemesConfig): Promise<void> {
    this.themes = config;
    await localStorage.set("themesConfig", config);
  }

  getThemes(): ThemesConfig {
    return this.themes;
  }

  getTokenSets(): TokenSet[] {
    return Array.from(this.tokenSets.values());
  }

  /**
   * Deep merge multiple token sets with last-write-wins semantics.
   * Later sets override earlier sets at the token level (matching Tokens Studio behavior).
   */
  mergeTokenSets(setRefs: TokenSetRef[]): Record<string, unknown> {
    const merged: Record<string, unknown> = {};

    for (const ref of setRefs) {
      if (!ref.enabled) continue;
      const tokenSet = this.tokenSets.get(ref.name);
      if (!tokenSet) continue;
      this.deepMerge(merged, tokenSet.tokens);
    }

    return merged;
  }

  private deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
    for (const [key, value] of Object.entries(source)) {
      if (
        isObject(value) &&
        isObject(target[key]) &&
        !("$value" in (value as Record<string, unknown>))
      ) {
        // Recurse for non-token objects
        this.deepMerge(target[key] as Record<string, unknown>, value as Record<string, unknown>);
      } else {
        // Last-write-wins for tokens and primitives
        target[key] = value;
      }
    }
  }

  /**
   * Apply a theme: merge its token sets and import the result into Figma.
   */
  async applyTheme(theme: TokenTheme) {
    const merged = this.mergeTokenSets(theme.sets);

    // Import variables
    const vars = await variablesService.import(merged);

    // Import styles
    const typo = await stylesService.importTypography(merged);
    const shadows = await stylesService.importShadows(merged);
    const paints = await stylesService.importPaints(merged);

    return {
      created: vars.created + typo.created + shadows.created + paints.created,
      updated: vars.updated + typo.updated + shadows.updated + paints.updated,
    };
  }
}

export const themesService = new ThemesService();
