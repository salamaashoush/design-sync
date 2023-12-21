import { AzureDevOpsStorage } from './azureDevops';
import { BitbucketStorage } from './bitbucket';
import type { Base64Encoder, GitInfo } from './git';
import { GithubStorage } from './github';
import { GitlabStorage } from './gitlab';

const inputRegex = /^(?<provider>[\w-.]+):(?<repo>[\w.-]+\/[\w.-]+)(?<path>[^#]+)?#?(?<ref>[\w./-]+)?/;

const providerShortcuts: Record<string, string> = {
  gh: 'github',
  gl: 'gitlab',
  bb: 'bitbucket',
  az: 'azure',
};

export function parseGitURI(input: string): GitInfo {
  const m = input.match(inputRegex)?.groups || {};
  const provider = m.provider || 'github';
  console.log('M', m, input);
  return {
    provider: (providerShortcuts[provider] || provider) as GitInfo['provider'],
    repo: m.repo,
    path: m.path || '/',
    ref: m.ref ?? 'main',
  };
}

export function createGitStorage(
  infoOrUri: string | GitInfo,
  accessToken: string,
  lastSha = '',
  base64?: Base64Encoder,
) {
  const info = typeof infoOrUri === 'string' ? parseGitURI(infoOrUri) : infoOrUri;
  switch (info.provider) {
    case 'github':
      return new GithubStorage(
        {
          ...info,
          lastSha,
          accessToken,
        },
        base64,
      );
    case 'gitlab':
      return new GitlabStorage(
        {
          ...info,
          lastSha,
          accessToken,
        },
        base64,
      );
    case 'bitbucket':
      return new BitbucketStorage(
        {
          ...info,
          lastSha,
          accessToken,
        },
        base64,
      );
    case 'azure':
      return new AzureDevOpsStorage(
        {
          ...info,
          lastSha,
          accessToken,
        },
        base64,
      );
    default:
      throw new Error('Invalid git provider');
  }
}
