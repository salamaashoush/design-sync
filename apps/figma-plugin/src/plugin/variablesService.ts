import { camelCase, set } from '@design-sync/utils';
import { DEFAULT_MODE, TokensWalker, isTokenAlias, normalizeTokenAlias } from '@design-sync/w3c-dtfm';
import { convertValue, deserializeColor, isColorVariableValue, isVariableAlias, serializeColor } from './utils';
import { designTokenTypeToVariableType, guessTokenTypeFromScopes } from './variables';

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
    const collection = figma.variables.getVariableCollectionById(collectionId ?? variable?.variableCollectionId ?? '');
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

  private getCollection(name: string, modes: string[] = [], defaultMode = 'Value') {
    const collection =
      this.getLocalCollections().find((c) => c.name === name) ?? figma.variables.createVariableCollection(name);
    if (modes.length > 0) {
      collection.renameMode(collection.defaultModeId, defaultMode === DEFAULT_MODE ? 'Value' : defaultMode);
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
      collection.modes.find((m) => m.name === mode || m.modeId === mode)?.modeId ?? collection.defaultModeId;
    const variable =
      this.variablesStore.find(name, modeId, collection.id) ??
      figma.variables.createVariable(name, collection.id, type);
    console.log('createOrUpdateVariable', variable, modeId, value);
    variable.setValueForMode(modeId, value);
    return variable;
  }

  private createVariableAlias(name: string, mode: string, ref: string, collection: VariableCollection) {
    const refVariable = this.variablesStore.getByName(ref);
    if (!refVariable) {
      throw new Error(`Variable ${ref} not found`);
    }
    const modeId =
      collection.modes.find((m) => m.name === mode || m.modeId === mode)?.modeId ?? collection.defaultModeId;
    console.log('createVariableAlias', refVariable, name, this.aliasesToProcess);
    return this.createOrUpdateVariable(
      modeId,
      refVariable.resolvedType,
      name,
      {
        type: 'VARIABLE_ALIAS',
        id: `${refVariable.id}`,
      },
      collection,
    );
  }

  private processAliases(collection: VariableCollection) {
    const aliasesValues = Object.values(this.aliasesToProcess);
    let generations = aliasesValues.length;
    while (aliasesValues.length && generations > 0) {
      for (let i = 0; i < aliasesValues.length; i++) {
        const { name, refName, mode } = aliasesValues[i];
        if (this.variablesStore.find(refName)) {
          aliasesValues.splice(i, 1);
          this.variablesStore.set(name, this.createVariableAlias(name, mode, refName, collection));
        }
      }
      generations--;
    }
    this.aliasesToProcess = {};
  }

  fromJSON(tokens: Record<string, unknown>) {
    const walker = new TokensWalker(tokens);
    const { requiredModes, defaultMode } = walker.getModes();
    const name = walker.getName();
    const collection = this.getCollection(name, requiredModes, defaultMode);
    walker.walk((token) => {
      const figmaType = designTokenTypeToVariableType(token.type);
      const name = token.path.trim().replace(/\./g, '/');
      for (const mode of Object.keys(token.requiredModes)) {
        const modeValue = token.getRawValueByMode(mode) as string;
        if (isTokenAlias(modeValue)) {
          const refName = normalizeTokenAlias(modeValue).trim().replace(/\./g, '/');
          if (this.variablesStore.has(refName)) {
            this.variablesStore.set(name, this.createVariableAlias(name, mode, refName, collection));
          } else {
            this.aliasesToProcess[name] = {
              name,
              type: token.type,
              mode,
              refName,
            };
          }
        } else {
          const value = figmaType === 'COLOR' ? deserializeColor(modeValue) : convertValue(modeValue).value;
          this.variablesStore.set(name, this.createOrUpdateVariable(mode, figmaType, name, value, collection));
        }
      }
    });
    this.processAliases(collection);
  }

  private serializeVariableValue(value: VariableValue, resolvedType: VariableResolvedDataType) {
    if (value !== undefined && ['COLOR', 'FLOAT'].includes(resolvedType ?? '')) {
      if (isVariableAlias(value)) {
        return `{${figma.variables.getVariableById(value.id)!.name.replace(/\//g, '.')}}`;
      }
      if (resolvedType === 'COLOR' && isColorVariableValue(value)) {
        return serializeColor(value);
      }
      return value.toString();
    }
    return '';
  }

  exportCollectionToDesignTokens({ name: collectionName, modes, variableIds, defaultModeId }: VariableCollection) {
    const tokens: Record<string, any> = {
      $name: collectionName,
      $extensions:
        modes?.length > 1
          ? {
              requiredModes: modes.map(({ name }) => camelCase(name)),
              defaultMode: camelCase(modes.find(({ modeId }) => modeId === defaultModeId)?.name ?? ''),
            }
          : undefined,
    };
    for (const variableId of variableIds) {
      const { name, resolvedType, valuesByMode, description, scopes } = figma.variables.getVariableById(variableId)!;
      const fullPath = `${name.replace(/\//g, '.').split('.').map(camelCase).join('.')}`;
      const token = {
        $value: this.serializeVariableValue(valuesByMode?.[defaultModeId], resolvedType),
        $description: description ?? '',
        $type: resolvedType === 'COLOR' ? 'color' : guessTokenTypeFromScopes(scopes),
      };
      if (modes?.length > 1) {
        for (const mode of modes) {
          const value = valuesByMode?.[mode.modeId];
          const modeKey = camelCase(mode.name === 'Value' ? 'default' : mode.name);
          set(token, `$extensions.mode.${modeKey}`, this.serializeVariableValue(value, resolvedType));
        }
      }
      set(tokens, fullPath, token);
    }
    const hasModes = Object.keys(tokens).length > 1;
    return hasModes ? tokens : tokens.default;
  }

  async toJSON(collectionIds: string[], singleFile = false) {
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
        name: 'tokens',
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
