import { GitStorage, SaveFileOptions } from './git';

export class BitbucketStorage extends GitStorage {
  async exists(filePath: string): Promise<boolean> {
    return this.load(filePath)
      .then(() => true)
      .catch(() => false);
  }

  async save(tokens: any, { commitMessage, filePath, branch }: SaveFileOptions): Promise<void> {
    const projectId = encodeURIComponent(this.options.repoPath);
    const b = branch || this.options.branch;
    const exists = await this.exists(filePath);
    const content = JSON.stringify(tokens, null, 2);
    const actions = [
      {
        action: exists ? 'update' : 'create',
        file_path: filePath,
        content,
      },
    ];
    const response = await fetch(`https://api.bitbucket.org/2.0/repositories/${projectId}/src`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.options.accessToken}`,
      },
      body: JSON.stringify({
        id: projectId,
        branch: b,
        commit_message: commitMessage,
        actions,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to save tokens');
    }
  }

  async load(filePath: string): Promise<any> {
    const projectId = encodeURIComponent(this.options.repoPath);
    const path = encodeURIComponent(filePath);
    const branch = encodeURIComponent(this.options.branch);
    const response = await fetch(`https://api.bitbucket.org/2.0/repositories/${projectId}/src/${branch}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.options.accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to load tokens');
    }
    return JSON.parse(await response.text());
  }
}
