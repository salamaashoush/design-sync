import { GitStorage, SaveFileOptions } from './git';
import { s } from './ss';

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
  private async fetchFile(filePath: string): Promise<GithubFile> {
    const response = await fetch(
      `https://api.github.com/repos/${this.options.repoPath}/contents/${filePath}?ref=${this.options.branch}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github+json',
          Authorization: `token ${this.options.accessToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    // throw for non 200 status codes
    if (!response.ok) {
      throw new Error('Failed to load tokens');
    }
    return response.json();
  }

  async save(tokens: any, { commitMessage, filePath }: SaveFileOptions): Promise<void> {
    let sha = undefined;
    try {
      const data = await this.fetchFile(filePath);
      sha = data.sha;
    } catch (e) {}

    const response = await fetch(`https://api.github.com/repos/${this.options.repoPath}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${this.options.accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        branch: this.options.branch,
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

  async load(filePath: string): Promise<any> {
    const data = await this.fetchFile(filePath);
    console.log(data.content);
    return JSON.parse(this.base64.decode(s));
  }
}
