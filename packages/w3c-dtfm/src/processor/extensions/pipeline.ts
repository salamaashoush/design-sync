import type { TokenType } from "../../types";
import { compileFilter, type CompiledFilter } from "../filter";
import type {
  AddTokenAction,
  ExtensionContext,
  ProcessedToken,
  ProcessorError,
  ProcessorExtension,
  ProcessorModes,
  ProcessorWarning,
  TokenAction,
  TokenProcessorInterface,
  UpdateTokenAction,
} from "../types";
import { createExtensionContext } from "./context";

/**
 * Internal extension entry with compiled filter
 */
interface ExtensionEntry {
  extension: ProcessorExtension;
  filter: CompiledFilter;
  priority: number;
}

/**
 * Context factory type
 */
type ContextFactory = (extensionName: string) => ExtensionContext;

/**
 * Extension pipeline that manages extension lifecycle and execution
 */
export class ExtensionPipeline {
  private extensions: ExtensionEntry[] = [];
  private sharedState = new Map<string, unknown>();
  private warnings: ProcessorWarning[] = [];
  private errors: ProcessorError[] = [];
  private extensionsRun: string[] = [];

  /**
   * Add an extension to the pipeline
   */
  add(extension: ProcessorExtension): this {
    const filter = compileFilter(extension.filter);
    const priority = extension.priority ?? 0;

    this.extensions.push({ extension, filter, priority });
    this.extensions.sort((a, b) => b.priority - a.priority);

    return this;
  }

  /**
   * Add multiple extensions
   */
  addAll(extensions: ProcessorExtension[]): this {
    for (const ext of extensions) {
      this.add(ext);
    }
    return this;
  }

  /**
   * Remove an extension by name
   */
  remove(name: string): this {
    this.extensions = this.extensions.filter((e) => e.extension.name !== name);
    return this;
  }

  /**
   * Clear all extensions
   */
  clear(): this {
    this.extensions = [];
    return this;
  }

  /**
   * Get all extension names
   */
  getExtensionNames(): string[] {
    return this.extensions.map((e) => e.extension.name);
  }

  /**
   * Get all schema-phase extensions (those with phase: "schema" and onSchemaToken hook)
   */
  getSchemaExtensions(): ProcessorExtension[] {
    return this.extensions
      .filter((e) => e.extension.phase === "schema" && e.extension.onSchemaToken)
      .map((e) => e.extension);
  }

  /**
   * Get all token-phase extensions (default phase or explicit "token")
   */
  getTokenExtensions(): ProcessorExtension[] {
    return this.extensions
      .filter((e) => !e.extension.phase || e.extension.phase === "token")
      .map((e) => e.extension);
  }

  /**
   * Run the init phase for all extensions
   */
  async runInit(contextFactory: ContextFactory): Promise<void> {
    for (const { extension } of this.extensions) {
      if (extension.onInit) {
        try {
          const context = contextFactory(extension.name);
          await extension.onInit(context);
        } catch (error) {
          this.errors.push({
            message: `[${extension.name}] Init failed: ${error}`,
            cause: error instanceof Error ? error : undefined,
          });
        }
      }
    }
  }

  /**
   * Run the onToken phase for a single token
   */
  async runOnToken(token: ProcessedToken, contextFactory: ContextFactory): Promise<TokenAction[]> {
    const allActions: TokenAction[] = [];

    for (const { extension, filter } of this.extensions) {
      if (!filter(token)) {
        continue;
      }

      if (extension.onToken) {
        try {
          const context = contextFactory(extension.name);
          const actions = await extension.onToken(token, context);
          if (actions && actions.length > 0) {
            allActions.push(...actions);
            if (!this.extensionsRun.includes(extension.name)) {
              this.extensionsRun.push(extension.name);
            }
          }
        } catch (error) {
          this.errors.push({
            message: `[${extension.name}] Failed on token "${token.path}": ${error}`,
            path: token.path,
            cause: error instanceof Error ? error : undefined,
          });
        }
      }
    }

    return allActions;
  }

  /**
   * Run the onPostProcess phase for all tokens
   */
  async runPostProcess(
    tokens: ProcessedToken[],
    contextFactory: ContextFactory,
  ): Promise<TokenAction[]> {
    const allActions: TokenAction[] = [];

    for (const { extension } of this.extensions) {
      if (extension.onPostProcess) {
        try {
          const context = contextFactory(extension.name);
          const actions = await extension.onPostProcess(tokens, context);
          if (actions && actions.length > 0) {
            allActions.push(...actions);
            if (!this.extensionsRun.includes(extension.name)) {
              this.extensionsRun.push(extension.name);
            }
          }
        } catch (error) {
          this.errors.push({
            message: `[${extension.name}] PostProcess failed: ${error}`,
            cause: error instanceof Error ? error : undefined,
          });
        }
      }
    }

    return allActions;
  }

  /**
   * Run the complete phase for all extensions
   */
  async runComplete(contextFactory: ContextFactory): Promise<void> {
    for (const { extension } of this.extensions) {
      if (extension.onComplete) {
        try {
          const context = contextFactory(extension.name);
          await extension.onComplete(context);
        } catch (error) {
          this.errors.push({
            message: `[${extension.name}] Complete failed: ${error}`,
            cause: error instanceof Error ? error : undefined,
          });
        }
      }
    }
  }

  /**
   * Run error handlers for all extensions
   */
  async runOnError(error: Error, contextFactory: ContextFactory): Promise<void> {
    for (const { extension } of this.extensions) {
      if (extension.onError) {
        try {
          const context = contextFactory(extension.name);
          await extension.onError(error, context);
        } catch (handlerError) {
          console.error(`[${extension.name}] Error handler failed:`, handlerError);
        }
      }
    }
  }

  getWarnings(): ProcessorWarning[] {
    return this.warnings;
  }

  getErrors(): ProcessorError[] {
    return this.errors;
  }

  getExtensionsRun(): string[] {
    return this.extensionsRun;
  }

  getSharedState(): Map<string, unknown> {
    return this.sharedState;
  }

  reset(): void {
    this.warnings = [];
    this.errors = [];
    this.extensionsRun = [];
    this.sharedState.clear();
  }
}

/**
 * Create a context factory function for the pipeline
 */
export function createContextFactory(
  processor: TokenProcessorInterface,
  modes: ProcessorModes,
  resolveAlias: (alias: string) => unknown,
  normalizeValue: (value: unknown, type: TokenType) => unknown,
  getToken: (path: string) => ProcessedToken | undefined,
  warnings: ProcessorWarning[],
  errors: ProcessorError[],
  sharedState: Map<string, unknown>,
): ContextFactory {
  return (extensionName: string) =>
    createExtensionContext(
      processor,
      modes,
      extensionName,
      resolveAlias,
      normalizeValue,
      getToken,
      warnings,
      errors,
      sharedState,
    );
}

/**
 * Create a new extension pipeline
 */
export function createExtensionPipeline(): ExtensionPipeline {
  return new ExtensionPipeline();
}

/**
 * Apply token actions to the token map
 */
export function applyTokenActions(
  actions: TokenAction[],
  tokenMap: Map<string, ProcessedToken>,
  createToken: (action: AddTokenAction) => ProcessedToken,
  updateToken: (token: ProcessedToken, action: UpdateTokenAction) => void,
): { added: number; updated: number; removed: number } {
  let added = 0;
  let updated = 0;
  let removed = 0;

  for (const action of actions) {
    switch (action.type) {
      case "add": {
        if (!tokenMap.has(action.path)) {
          const token = createToken(action);
          tokenMap.set(action.path, token);
          added++;
        }
        break;
      }
      case "update": {
        const existingToken = tokenMap.get(action.path);
        if (existingToken) {
          updateToken(existingToken, action);
          updated++;
        }
        break;
      }
      case "remove": {
        for (const path of action.paths) {
          if (tokenMap.delete(path)) {
            removed++;
          }
        }
        break;
      }
    }
  }

  return { added, updated, removed };
}
