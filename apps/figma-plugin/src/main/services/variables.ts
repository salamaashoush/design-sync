import { camelCase, set } from "@design-sync/utils";
import { createTokenProcessor, isTokenAlias, normalizeTokenAlias } from "@design-sync/w3c-dtfm";
import type { DiffResult } from "../../shared/types";
import {
  deserializeColor,
  isColorVariableValue,
  isGradientValue,
  isVariableAlias,
  serializeColor,
} from "../utils/colors";
import { convertValue } from "../utils/fonts";
import { designTokenTypeToVariableType, guessTokenTypeFromScopes } from "../utils/variables";

export class VariablesStore {
  private store: Map<string, Variable> = new Map();
  constructor() {
    const collections = figma.variables.getLocalVariableCollections();
    for (const collection of collections) {
      this.fromCollection(collection);
    }
  }

  fromCollection(collection: VariableCollection) {
    for (const variableId of collection.variableIds) {
      const variable = figma.variables.getVariableById(variableId)!;
      this.set(variable.name, variable);
    }
  }

  set(key: string, variable: Variable) {
    this.store.set(key, variable);
  }

  has(key: string) {
    return this.store.has(key);
  }

  getByName(name: string) {
    if (this.store.has(name)) {
      return this.store.get(name);
    }
    for (const variable of this.store.values()) {
      if (variable.name === name) {
        return variable;
      }
    }
  }

  find(name: string, modeId?: string, collectionId?: string) {
    const variable = this.getByName(name);
    if (!modeId) {
      return variable;
    }
    const collection = figma.variables.getVariableCollectionById(
      collectionId ?? variable?.variableCollectionId ?? "",
    );
    if (collection?.modes.some((m) => m.modeId === modeId)) {
      return variable;
    }
  }

  get(key: string) {
    return this.store.get(key);
  }
}

export class VariablesService {
  private aliasesToProcess: Record<string, any> = {};

  constructor(private variablesStore: VariablesStore = new VariablesStore()) {}

  getLocalCollections(ids?: string[]) {
    const all = figma.variables.getLocalVariableCollections();
    if (!ids) {
      return all;
    }
    return all.filter((c) => ids.includes(c.id));
  }

  async getLibraryCollections(ids?: string[]) {
    const all = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    if (!ids) {
      return all;
    }
    return all.filter((c) => ids.includes(c.key));
  }

  private getCollection(name: string, modes: string[] = [], defaultMode = "Value") {
    const collection =
      this.getLocalCollections().find((c) => c.name === name) ??
      figma.variables.createVariableCollection(name);
    if (modes.length > 0) {
      collection.renameMode(
        collection.defaultModeId,
        defaultMode === "default" ? "Value" : defaultMode,
      );
    }

    for (const mode of modes) {
      if (!collection.modes.some((m) => m.name === mode)) {
        collection.addMode(mode);
      }
    }
    return collection;
  }

  private createOrUpdateVariable(
    mode: string,
    type: VariableResolvedDataType,
    name: string,
    value: VariableValue,
    collection: VariableCollection,
  ) {
    const modeId =
      collection.modes.find((m) => m.name === mode || m.modeId === mode)?.modeId ??
      collection.defaultModeId;
    const variable =
      this.variablesStore.find(name, modeId, collection.id) ??
      figma.variables.createVariable(name, collection.id, type);
    console.log("createOrUpdateVariable", variable, modeId, value);
    variable.setValueForMode(modeId, value);
    return variable;
  }

  private createVariableAlias(
    name: string,
    mode: string,
    ref: string,
    collection: VariableCollection,
  ) {
    const refVariable = this.variablesStore.getByName(ref);
    if (!refVariable) {
      throw new Error(`Variable ${ref} not found`);
    }
    const modeId =
      collection.modes.find((m) => m.name === mode || m.modeId === mode)?.modeId ??
      collection.defaultModeId;
    console.log("createVariableAlias", refVariable, name, this.aliasesToProcess);
    return this.createOrUpdateVariable(
      modeId,
      refVariable.resolvedType,
      name,
      {
        type: "VARIABLE_ALIAS",
        id: `${refVariable.id}`,
      },
      collection,
    );
  }

  private processAliases(collection: VariableCollection) {
    const aliases = { ...this.aliasesToProcess };
    const resolved = new Set<string>();
    const inProgress = new Set<string>();

    const resolve = (varName: string): boolean => {
      if (resolved.has(varName)) return true;
      if (inProgress.has(varName)) {
        console.warn(`Circular alias detected for "${varName}" — skipping`);
        return false;
      }

      const alias = aliases[varName];
      if (!alias) return this.variablesStore.has(varName);

      inProgress.add(varName);

      // If the reference is already a known variable, resolve directly
      if (this.variablesStore.has(alias.refName)) {
        this.variablesStore.set(
          varName,
          this.createVariableAlias(varName, alias.mode, alias.refName, collection),
        );
        inProgress.delete(varName);
        resolved.add(varName);
        return true;
      }

      // Otherwise, try to resolve the reference first (it might be another alias)
      if (resolve(alias.refName)) {
        this.variablesStore.set(
          varName,
          this.createVariableAlias(varName, alias.mode, alias.refName, collection),
        );
        inProgress.delete(varName);
        resolved.add(varName);
        return true;
      }

      inProgress.delete(varName);
      console.warn(`Unresolvable alias "${varName}" → "${alias.refName}" — skipping`);
      return false;
    };

    for (const varName of Object.keys(aliases)) {
      resolve(varName);
    }

    this.aliasesToProcess = {};
  }

  async import(tokens: Record<string, unknown>): Promise<{ created: number; updated: number }> {
    const processor = createTokenProcessor(tokens);
    const _result = await processor.process();
    const modes = processor.modes;
    // Get name from tokens.$name or first key
    const name = (tokens["$name"] as string) ?? Object.keys(tokens)[0] ?? "tokens";
    const collection = this.getCollection(name, [...modes.availableModes], modes.defaultMode);

    let created = 0;
    let updated = 0;

    for (const token of processor.tokens()) {
      const figmaType = designTokenTypeToVariableType(token.type);
      const varName = token.path.replace(/\./g, "/");

      // Skip gradient tokens — they can't be Figma variables (handled via style import)
      if (figmaType === "COLOR") {
        const defaultValue = String(token.value);
        if (isGradientValue(defaultValue)) {
          console.warn(
            `Skipping gradient token "${varName}" — gradients are imported as styles, not variables`,
          );
          continue;
        }
      }

      const isNew = !this.variablesStore.has(varName);

      for (const [mode, modeValue] of Object.entries(token.modeValues)) {
        const rawValue = token.getRawValue(mode);
        if (isTokenAlias(rawValue)) {
          const refName = normalizeTokenAlias(rawValue).replace(/\./g, "/");
          if (this.variablesStore.has(refName)) {
            this.variablesStore.set(
              varName,
              this.createVariableAlias(varName, mode, refName, collection),
            );
          } else {
            this.aliasesToProcess[varName] = {
              name: varName,
              type: token.type,
              mode,
              refName,
            };
          }
        } else {
          const value =
            figmaType === "COLOR"
              ? deserializeColor(String(modeValue))
              : convertValue(String(modeValue)).value;
          this.variablesStore.set(
            varName,
            this.createOrUpdateVariable(mode, figmaType, varName, value, collection),
          );
        }
      }

      if (isNew) {
        created++;
      } else {
        updated++;
      }
    }
    this.processAliases(collection);
    return { created, updated };
  }

  async diffImport(tokens: Record<string, unknown>): Promise<DiffResult> {
    const processor = createTokenProcessor(tokens);
    await processor.process();
    const _modes = processor.modes;
    const name = (tokens["$name"] as string) ?? Object.keys(tokens)[0] ?? "tokens";
    const diff: DiffResult = [];

    // Track which remote token paths exist for detecting removals
    const remoteTokenPaths = new Set<string>();

    for (const token of processor.tokens()) {
      const varName = token.path.replace(/\./g, "/");
      remoteTokenPaths.add(varName);

      const existingVar = this.variablesStore.getByName(varName);
      if (!existingVar) {
        diff.push({
          path: varName,
          type: "add",
          newValue: String(token.value),
        });
      } else {
        // Compare default mode value
        const newValue = String(token.value);
        const existingValue = this.serializeVariableValue(
          existingVar.valuesByMode?.[
            figma.variables.getVariableCollectionById(existingVar.variableCollectionId)
              ?.defaultModeId ?? ""
          ],
          existingVar.resolvedType,
        );
        if (newValue !== existingValue) {
          diff.push({
            path: varName,
            type: "update",
            oldValue: existingValue,
            newValue,
          });
        }
      }
    }

    // Check for variables that exist locally but not in remote tokens
    const collections = this.getLocalCollections();
    const matchingCollection = collections.find((c) => c.name === name);
    if (matchingCollection) {
      for (const variableId of matchingCollection.variableIds) {
        const variable = figma.variables.getVariableById(variableId)!;
        if (!remoteTokenPaths.has(variable.name)) {
          diff.push({
            path: variable.name,
            type: "remove",
            oldValue: this.serializeVariableValue(
              variable.valuesByMode?.[matchingCollection.defaultModeId],
              variable.resolvedType,
            ),
          });
        }
      }
    }

    return diff;
  }

  private serializeVariableValue(value: VariableValue, resolvedType: VariableResolvedDataType) {
    if (value !== undefined && ["COLOR", "FLOAT"].includes(resolvedType ?? "")) {
      if (isVariableAlias(value)) {
        return `{${figma.variables.getVariableById(value.id)!.name.replace(/\//g, ".")}}`;
      }
      if (resolvedType === "COLOR" && isColorVariableValue(value)) {
        return serializeColor(value);
      }
      return value.toString();
    }
    return "";
  }

  exportCollectionToDesignTokens({
    name: collectionName,
    modes,
    variableIds,
    defaultModeId,
  }: VariableCollection) {
    const tokens: Record<string, any> = {
      $name: collectionName,
      $extensions:
        modes?.length > 1
          ? {
              requiredModes: modes.map(({ name }) => camelCase(name)),
              defaultMode: camelCase(
                modes.find(({ modeId }) => modeId === defaultModeId)?.name ?? "",
              ),
            }
          : undefined,
    };
    for (const variableId of variableIds) {
      const { name, resolvedType, valuesByMode, description, scopes } =
        figma.variables.getVariableById(variableId)!;
      const fullPath = `${name.replace(/\//g, ".").split(".").map(camelCase).join(".")}`;
      const token = {
        $value: this.serializeVariableValue(valuesByMode?.[defaultModeId], resolvedType),
        $description: description ?? "",
        $type: resolvedType === "COLOR" ? "color" : guessTokenTypeFromScopes(scopes),
      };
      if (modes?.length > 1) {
        for (const mode of modes) {
          const value = valuesByMode?.[mode.modeId];
          const modeKey = camelCase(mode.name === "Value" ? "default" : mode.name);
          set(
            token,
            `$extensions.mode.${modeKey}`,
            this.serializeVariableValue(value, resolvedType),
          );
        }
      }
      set(tokens, fullPath, token);
    }
    const hasModes = Object.keys(tokens).length > 1;
    return hasModes ? tokens : tokens.default;
  }

  async exportToDesignTokens(collectionIds: string[], singleFile = false) {
    const collections = this.getLocalCollections(collectionIds);
    const files = [];
    if (singleFile) {
      const allTokens = {};
      for (const collection of collections) {
        const tokens = this.exportCollectionToDesignTokens(collection);
        Object.assign(allTokens, {
          [camelCase(collection.name)]: tokens,
        });
      }
      files.push({
        name: "tokens",
        tokens: allTokens,
      });
    } else {
      for (const collection of collections) {
        const tokens = this.exportCollectionToDesignTokens(collection);
        files.push({
          name: camelCase(collection.name),
          tokens,
        });
      }
    }
    return files;
  }
}

export const variablesService = new VariablesService();
