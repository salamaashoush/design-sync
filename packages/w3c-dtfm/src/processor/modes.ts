import { isObject } from "@design-sync/utils";
import { hasModeExtension, hasModesExtension } from "../guards";
import type { DesignToken } from "../types";
import type { ProcessorModes } from "./types";

const DEFAULT_MODE = "default";

/**
 * Mode configuration
 */
export interface ModesConfig {
  default?: string;
  required?: string[];
}

/**
 * Implementation of ProcessorModes interface
 */
export class ProcessorModesImpl implements ProcessorModes {
  private _defaultMode: string;
  private _requiredModes: readonly string[];
  private _availableModes: Set<string>;

  constructor(config?: ModesConfig) {
    this._defaultMode = config?.default ?? DEFAULT_MODE;
    this._requiredModes = Object.freeze(config?.required ?? [this._defaultMode]);
    this._availableModes = new Set(this._requiredModes);
  }

  get defaultMode(): string {
    return this._defaultMode;
  }

  get requiredModes(): readonly string[] {
    return this._requiredModes;
  }

  get availableModes(): readonly string[] {
    return Array.from(this._availableModes);
  }

  hasMode(mode: string): boolean {
    return this._availableModes.has(mode);
  }

  /**
   * Register an available mode (used internally when discovering modes from tokens)
   */
  _registerMode(mode: string): void {
    this._availableModes.add(mode);
  }

  /**
   * Register multiple modes at once
   */
  _registerModes(modes: string[]): void {
    for (const mode of modes) {
      this._availableModes.add(mode);
    }
  }
}

/**
 * Create a ProcessorModes instance
 */
export function createProcessorModes(config?: ModesConfig): ProcessorModesImpl {
  return new ProcessorModesImpl(config);
}

/**
 * Extract mode values from a design token
 */
export function extractModeValuesFromToken(
  token: DesignToken,
  modes: ProcessorModesImpl,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Add the default value
  result[modes.defaultMode] = token.$value;

  // Safely check for extensions
  if (!token.$extensions || !isObject(token.$extensions)) {
    return result;
  }

  // Extract mode-specific values from extension
  if ("mode" in token.$extensions && isObject(token.$extensions.mode)) {
    const modeExtension = token.$extensions.mode as Record<string, unknown>;
    for (const [mode, value] of Object.entries(modeExtension)) {
      result[mode] = value;
      modes._registerMode(mode);
    }
  }

  // Handle the modes extension (metadata about available modes)
  if ("modes" in token.$extensions && isObject(token.$extensions.modes)) {
    const modesExt = token.$extensions.modes as { requiredModes?: string[] };
    if (modesExt.requiredModes) {
      modes._registerModes(modesExt.requiredModes);
    }
  }

  return result;
}

/**
 * Get the raw value for a specific mode from a token
 */
export function getRawModeValue(token: DesignToken, mode: string, defaultMode: string): unknown {
  // Check mode extension first
  if (hasModeExtension(token)) {
    const modeExtension = token.$extensions.mode;
    if (isObject(modeExtension) && mode in modeExtension) {
      return modeExtension[mode];
    }
  }

  // Fall back to default value
  if (mode === defaultMode) {
    return token.$value;
  }

  return undefined;
}

/**
 * Discover all modes used across a set of tokens
 */
export function discoverModes(
  tokens: Map<string, DesignToken>,
  config?: ModesConfig,
): ProcessorModesImpl {
  const modes = createProcessorModes(config);

  for (const token of tokens.values()) {
    if (hasModeExtension(token)) {
      const modeExtension = token.$extensions.mode;
      if (isObject(modeExtension)) {
        modes._registerModes(Object.keys(modeExtension));
      }
    }
    if (hasModesExtension(token)) {
      const modesExt = token.$extensions.modes;
      if (modesExt.requiredModes) {
        modes._registerModes(modesExt.requiredModes);
      }
    }
  }

  return modes;
}

/**
 * Validate that all required modes are present in a token's mode values
 */
export function validateRequiredModes(
  modeValues: Record<string, unknown>,
  requiredModes: readonly string[],
  path: string,
): string[] {
  const warnings: string[] = [];
  const availableModes = Object.keys(modeValues);

  for (const mode of requiredModes) {
    if (!availableModes.includes(mode)) {
      warnings.push(`Token "${path}" is missing required mode "${mode}"`);
    }
  }

  return warnings;
}
