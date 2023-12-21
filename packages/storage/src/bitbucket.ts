import { GitStorage, SaveFileOptions } from './git';

export class BitbucketStorage extends GitStorage {
  getSha(path?: string | undefined, force?: boolean | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async exists(filePath: string): Promise<boolean> {
    return this.load(filePath)
      .then(() => true)
      .catch(() => false);
  }

  async save(tokens: any, { commitMessage, filePath, branch }: SaveFileOptions): Promise<void> {
    const projectId = encodeURIComponent(this.repo);
    const b = branch || this.ref;
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
        Authorization: `Basic ${this.accessToken}`,
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

  async load(filePath?: string): Promise<any> {
    const projectId = encodeURIComponent(this.repo);
    const path = encodeURIComponent(filePath ?? this.path);
    const branch = encodeURIComponent(this.ref);
    const response = await fetch(`https://api.bitbucket.org/2.0/repositories/${projectId}/src/${branch}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to load tokens');
    }
    return JSON.parse(await response.text());
  }
}
