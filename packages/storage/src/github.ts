import { GitStorage, SaveFileOptions } from './git';
interface GithubFile {
  type: 'file';
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
// Github using the fetch api
export class GithubStorage extends GitStorage {
  private async getSha(path: string) {
    const data = await this.fetchContent(path);
    if (Array.isArray(data)) {
      const parentPath = path.split('/').slice(0, -1).join('/');
      const parent = await this.fetchContent(parentPath);
      return Array.isArray(parent) ? parent.find((f) => f.path === path)?.sha : parent.sha;
    }
    return data.sha;
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

  async save(tokens: any, { commitMessage, filePath }: SaveFileOptions): Promise<void> {
    const sha = await this.getSha(filePath);
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
      throw new Error('Failed to save tokens');
    }
  }

  async load(filePath?: string): Promise<any> {
    const data = await this.fetchContent(filePath ?? this.path);
    console.log(data);
    if (Array.isArray(data)) {
      return Promise.all(data.map((path) => this.load(path.path)));
    }
    return data;
  }
}
