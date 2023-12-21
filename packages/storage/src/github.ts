import { deepMerge } from '@design-sync/utils';
import { GitStorage, SaveFileOptions } from './git';
interface GithubFile {
  type: 'file' | 'dir';
  encoding: 'base64';
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
}

function isSourceDir(data: unknown): data is GithubFile[] {
  return (
    Array.isArray(data) &&
    data.every((f) => typeof f.path === 'string' && typeof f.sha === 'string' && typeof f.type === 'string')
  );
}
// Github using the fetch api
export class GithubStorage extends GitStorage {
  async getSha(path = this.path): Promise<string> {
    const res = await fetch(`https://api.github.com/repos/${this.repo}/git/trees/${this.ref}?recursive=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.raw',
        Authorization: `token ${this.accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const data = await res.json();
    console.log(data);
    return data.tree.find((f) => f.path === path)?.sha ?? '';
  }

  private async fetchContent(path: string): Promise<GithubFile> {
    const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/${path}?ref=${this.ref}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.raw',
        Authorization: `token ${this.accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    // throw for non 200 status codes
    if (!response.ok) {
      throw new Error('Failed to load tokens');
    }
    return response.json();
  }

  async save(tokens: object, { commitMessage, filePath }: SaveFileOptions): Promise<void> {
    const sha = this.lastSha ?? (await this.getSha(filePath));
    const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${this.repo}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        branch: this.ref,
        message: commitMessage,
        committer: {
          name: 'Salama Ashoush',
          email: 'salamaashoush@gamil.com',
        },
        sha,
        content: this.base64.encode(JSON.stringify(tokens)),
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to save tokens to github');
    }
    const data = await response.json();
    this.lastSha = data.commit.sha;
  }

  async load(path?: string): Promise<[string, any]> {
    const sha = await this.getSha(path);
    const data = await this.loadHelper(path ?? this.path);
    return [sha, data];
  }

  async loadHelper(path?: string): Promise<any> {
    const data = await this.fetchContent(path ?? this.path);
    if (isSourceDir(data)) {
      let files = [];
      for (const file of data) {
        // only fetch json files and directories
        if ((file.type === 'file' && file.path.endsWith('.json')) || file.type === 'dir') {
          files.push(this.loadHelper(file.path));
        }
      }
      files = await Promise.all(files);
      let tokens = {};
      for (const file of files) {
        tokens = deepMerge(tokens, file);
      }
      return tokens;
    }
    return data;
  }
}
