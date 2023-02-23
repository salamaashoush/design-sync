import type { Ref, Token, TokenSet } from "../types";
import { GitlabStorage } from "./storage/gitlab";
import { LocalStorage } from "./storage/localStorage";
import { get } from "./utils/helper";
import { isTokenReference } from "./utils/is";

export class TokensPluginBackend {
  private localStorage = new LocalStorage();
  private remoteStorage = new GitlabStorage({
    accessToken: "glpat-PyYSH5nFksXCFkNT3rX1",
    branch: "salama",
    repoPath: "quomd/development_platform/frontend/design-tokens",
  });

  private tokenSets: TokenSet[] = [];
  async getTokens() {
    if (!this.tokenSets.length) {
      const fromCache = await this.localStorage.get<TokenSet[]>("tokens");
      console.log("fromCache", fromCache);
      if (fromCache) {
        this.tokenSets = fromCache;
      } else {
        const tokens = await this.remoteStorage.load(
          "src/quin-pro-tokens.json"
        );
        this.tokenSets = [tokens];
        this.localStorage.set("tokens", this.tokenSets);
      }
    }
    return this.tokenSets;
  }

  resolveTokenRef(ref: Ref<string>) {
    const path = ref.replace(/[$,{}]/g, "");
    const tokens = this.tokenSets[0].tokens;
    return get(tokens, path);
  }

  resolveTokenValue<T extends Token>(value: T["value"]): any {
    if (isTokenReference(value)) {
      const resolved = this.resolveTokenRef(value).value;
      return this.resolveTokenValue(resolved);
    }
    if (typeof value === "object") {
      const resolved: any = {};
      for (const key in value) {
        resolved[key] = this.resolveTokenValue(value[key]);
      }
      return resolved;
    }
    return value;
  }
}

export const backend = new TokensPluginBackend();
