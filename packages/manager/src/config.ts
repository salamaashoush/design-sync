import { loadConfig } from "c12";
import type { DesignSyncConfig } from "./types";

export const defaultConfig: DesignSyncConfig = {
  uri: "",
  out: "src/tokens",
  cwd: process.cwd(),
  plugins: [],
};

export async function resolveConfig(overrides: Partial<DesignSyncConfig> = {}) {
  const configResult = await loadConfig<DesignSyncConfig>({
    name: "design-sync",
    defaults: defaultConfig,
    overrides: overrides as DesignSyncConfig,
  });
  return configResult.config as DesignSyncConfig;
}

export function defineConfig(config: DesignSyncConfig) {
  return config;
}
