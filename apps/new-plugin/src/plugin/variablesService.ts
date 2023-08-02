import { camelCase, get, isObject, set } from '@tokenize/utils';
import { DesignToken, DesignTokensGroup, isDesignToken, isTokenAlias } from '@tokenize/w3c-tokens';
import { DesignTokensGroupMetadata, DesignTokensMode } from '../types';
import { convertValue, deserialzeColor, isColorVariableValue, isVariableAlias, serailzeColor } from './utils';
import { SUPPORTED_TOKEN_TYPES, designTokenTypeToVariableType, guessTokenTypeFromScopes } from './variables';

export class VaraiblesStore {
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

  findVariable(name: string, modeId?: string, collectionId?: string) {
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

interface TokensBag {
  default?: Record<string, any>;
}
export class VaraiblesService {
  private aliasesToProcess: Record<string, any> = {};
  constructor(private variablesStore: VaraiblesStore = new VaraiblesStore()) {}

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

  private createCollection(name: string, modes: DesignTokensMode[] = []) {
    const collection = figma.variables.createVariableCollection(name);
    if (modes.length > 0) {
      collection.renameMode(collection.defaultModeId, modes[0].name);
    }
    for (const mode of modes) {
      if (!collection.modes.some((m) => m.name === mode.name)) {
        collection.addMode(mode.name);
      }
    }
    return collection;
  }

  private createOrUpdateVariable(
    collection: VariableCollection,
    modeId: string,
    type: VariableResolvedDataType,
    name: string,
    value: VariableValue,
  ) {
    const variable =
      this.variablesStore.findVariable(name, modeId, collection.id) ??
      figma.variables.createVariable(name, collection.id, type);
    console.log('createOrUpdateVariable', variable, modeId, value);
    variable.setValueForMode(modeId, value);
    return variable;
  }

  private createVariableAlais(collection: VariableCollection, modeId: string, key: string, ref: string) {
    const refVariable = this.variablesStore.getByName(ref);
    if (!refVariable) {
      throw new Error(`Variable ${ref} not found`);
    }
    console.log('createVariableAlais', refVariable, key, this.aliasesToProcess);
    return this.createOrUpdateVariable(collection, modeId, refVariable.resolvedType, key, {
      type: 'VARIABLE_ALIAS',
      id: `${refVariable.id}`,
    });
  }

  private processAliases(collection: VariableCollection) {
    const aliasesValues = Object.values(this.aliasesToProcess);
    let generations = aliasesValues.length;
    while (aliasesValues.length && generations > 0) {
      for (let i = 0; i < aliasesValues.length; i++) {
        const { key, valueKey, modeId } = aliasesValues[i];
        if (this.variablesStore.findVariable(valueKey)) {
          aliasesValues.splice(i, 1);
          this.variablesStore.set(key, this.createVariableAlais(collection, modeId, key, valueKey));
        }
      }
      generations--;
    }
    this.aliasesToProcess = {};
  }

  private traverseToken(collection: VariableCollection, modeId: string, tokenKey: string, tokenValue: any) {
    if (isDesignToken(tokenValue)) {
      if (!SUPPORTED_TOKEN_TYPES.includes(tokenValue.$type)) {
        return;
      }
      const type = designTokenTypeToVariableType(tokenValue.$type);
      if (isTokenAlias(tokenValue.$value)) {
        const valueKey = tokenValue.$value.trim().replace(/\./g, '/').replace(/[${}]/g, '');
        if (this.variablesStore.has(valueKey)) {
          this.createVariableAlais(collection, modeId, tokenKey, valueKey);
        } else {
          this.aliasesToProcess[tokenKey] = {
            key: tokenKey,
            type,
            modeId,
            valueKey,
          };
        }
      } else {
        const value =
          type === 'COLOR'
            ? deserialzeColor(tokenValue.$value as string)
            : convertValue(tokenValue.$value as string).value;
        this.createOrUpdateVariable(collection, modeId, type, tokenKey, value);
      }
    } else {
      for (const [key, value] of Object.entries(tokenValue)) {
        if (key.charAt(0) !== '$') {
          this.traverseToken(collection, modeId, `${tokenKey}/${key}`, value);
        }
      }
    }
  }
  private getDesignTokensGroupMetadata(group: DesignTokensGroup): DesignTokensGroupMetadata {
    const { $description, description, $extensions, modes, $modes, $name, name } = group as any;
    const inferredModes = ($extensions?.modes ?? modes ?? $modes ?? []).map((m: any) =>
      isObject(m) ? m : { name: m, id: m },
    );
    return {
      name: $name || name || '',
      description: $description || description || '',
      modes: inferredModes,
    };
  }

  private createCollectionFromDesignTokens(group: DesignTokensGroup) {
    const { name, modes } = this.getDesignTokensGroupMetadata(group);
    const collection = this.createCollection(name, modes);
    if (modes?.length) {
      for (const mode of modes) {
        this.createVariablesFromTokenSet(collection, get(group, mode.path), mode);
      }
    } else {
      this.createVariablesFromTokenSet(collection, group);
    }
  }

  private createVariablesFromTokenSet(
    collection: VariableCollection,
    tokens: Record<string, any>,
    mode?: DesignTokensMode,
  ) {
    const modeId = collection.modes.find((m) => m.name === mode?.name)?.modeId ?? collection.defaultModeId;
    for (const [key, value] of Object.entries(tokens)) {
      this.traverseToken(collection, modeId, key, value);
    }
    this.processAliases(collection);
  }

  importFromDesignTokens(group: DesignTokensGroup) {
    // const collectionsWithModes = collections.filter((c) => c.includes('/'));
    // const tokensByMode: Record<string, any> = {};
    // for (const collectionName of collectionsWithModes) {
    //   const [mode, collection] = collectionName.split('/');
    //   tokensByMode[collection] = tokensByMode[collection] ?? {
    //     modes: new Set(),
    //     tokens: {},
    //   };
    //   tokensByMode[collection].modes.add(mode);
    //   tokensByMode[collection].tokens[mode] = tokens[collectionName];
    // }
    // for (const [collection, { modes, tokens }] of Object.entries(tokensByMode)) {
    //   this.createCollectionFromDesignTokens(collection, tokens, modes);
    // }
    // const collectionsWithoutModes = collections.filter((c) => !c.includes('/'));
    // for (const collectionName of collectionsWithoutModes) {
    //   this.createCollectionFromDesignTokens(collectionName, tokens[collectionName]);
    // }

    this.createCollectionFromDesignTokens(group);
  }

  exportCollectionToDesignTokens({ name: collectionName, modes, variableIds }: VariableCollection) {
    const tokens: Record<string, any> = {
      $name: collectionName,
      $extensions:
        modes?.length > 1
          ? {
              modes: modes.map((m) => ({ name: m.name, id: m.modeId, path: camelCase(`${collectionName}/${m.name}`) })),
            }
          : undefined,
    };
    for (const mode of modes) {
      for (const variableId of variableIds) {
        const { name, resolvedType, valuesByMode, description, scopes } = figma.variables.getVariableById(variableId)!;
        const value = valuesByMode?.[mode.modeId];
        const modeKey = mode.name === 'Value' ? undefined : camelCase(`${collectionName}/${mode.name}`);
        if (value !== undefined && ['COLOR', 'FLOAT'].includes(resolvedType ?? '')) {
          const normalizedPath = `${name.replace(/\//g, '.').split('.').map(camelCase).join('.')}`;
          const fullPath = modeKey ? `${modeKey}.${normalizedPath}` : normalizedPath;
          const token: DesignToken = {
            $value: '' as any,
            $description: description ?? '',
            $type: resolvedType === 'COLOR' ? 'color' : guessTokenTypeFromScopes(scopes),
          };

          if (isVariableAlias(value)) {
            token.$value = `{${figma.variables.getVariableById(value.id)!.name.replace(/\//g, '.')}}`;
          } else if (resolvedType === 'COLOR' && isColorVariableValue(value)) {
            token.$value = serailzeColor(value);
          } else {
            token.$value = value;
          }
          set(tokens, fullPath, token);
        }
      }
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

export const varaiblesService = new VaraiblesService();
