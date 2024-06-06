import { GitlabStorage, LocalStorage } from '@design-sync/storage';
import { get } from '@design-sync/utils';
import type { Ref, Token, TokenSet } from '../types';
import { TOKEN_SET_1, TOKEN_SET_2 } from '../ui/data';
import { isTokenReference } from './utils/is';

export class TokensService {
  private activeTokenSet = TOKEN_SET_1 as unknown as TokenSet;
  private localStorage = new LocalStorage();
  private remoteStorage = new GitlabStorage({
    accessToken: 'xxxxx',
    repo: 'quin-pro/tokens',
    ref: 'master',
    path: 'src/quin-pro-tokens.json',
  });
  private tokenSets = [TOKEN_SET_1, TOKEN_SET_2] as TokenSet[];
  async getTokens() {
    if (!this.tokenSets.length) {
      const fromCache = await this.localStorage.get<TokenSet[]>('tokens');
      console.log('fromCache', fromCache);
      if (fromCache) {
        this.tokenSets = fromCache;
      } else {
        const tokens = await this.remoteStorage.load('src/quin-pro-tokens.json');
        this.tokenSets = [tokens];
        this.localStorage.set('tokens', this.tokenSets);
      }
    }
    return this.tokenSets;
  }

  getTokenByRefOrPath(ref: Ref<string> | string) {
    const path = ref.replace(/[$,{}]/g, '');
    const tokens = this.activeTokenSet.tokens;
    return get(tokens, path);
  }

  resolveTokenValue<T extends Token>(value: T['value']): T['value'] {
    console.log('resolveTokenValue', value);
    if (isTokenReference(value)) {
      const resolved = this.getTokenByRefOrPath(value).value;
      return this.resolveTokenValue(resolved);
    }
    if (typeof value === 'object') {
      const resolved: Record<string, unknown> = {};
      for (const key in value) {
        resolved[key] = this.resolveTokenValue(value[key]);
      }
      return resolved;
    }
    return value;
  }

  changeActiveSet(id: string) {
    const set = this.getSet(id);
    if (set) {
      this.activeTokenSet = set;
    }
  }

  getActiveSet() {
    return this.activeTokenSet;
  }

  getSet(id: string) {
    return this.tokenSets.find((set) => set.id === id);
  }
}

export const tokensService = new TokensService();
