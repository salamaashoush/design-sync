import { GitStorage, SaveFileOptions } from './git';

export class AzureDevOpsStorage extends GitStorage {
  async exists(filePath: string): Promise<boolean> {
    return this.load(filePath)
      .then(() => true)
      .catch(() => false);
  }

  private getAuthHeader() {
    const pat = btoa(`:${this.accessToken}`);
    return `Basic ${pat}`;
  }

  private async getRef(branch: string) {
    const [organization, repo] = this.repo.split('/');
    const filter = encodeURIComponent(`heads/${branch}`);
    const response = await fetch(
      `https://dev.azure.com/${organization}/_apis/git/repositories/${repo}/refs?filter=${filter}&api-version=5.1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to get ref');
    }
    const { value } = await response.json();
    return value[0];
  }

  async save(tokens: any, { commitMessage, filePath }: SaveFileOptions): Promise<void> {
    const exists = await this.exists(filePath);
    const ref = await this.getRef(this.ref);
    console.log(ref);
    const [organization, repo] = this.repo.split('/');
    const response = await fetch(
      `https://dev.azure.com/${organization}/_apis/git/repositories/${repo}/pushes?api-version=6.1-preview.2`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          refUpdates: [
            {
              name: ref.name,
              oldObjectId: ref.objectId,
            },
          ],
          commits: [
            {
              comment: commitMessage,
              changes: [
                {
                  changeType: exists ? 'edit' : 'add',
                  item: {
                    path: filePath,
                  },
                  newContent: {
                    content: JSON.stringify(tokens, null, 2),
                    contentType: 'rawtext',
                  },
                },
              ],
            },
          ],
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to save tokens');
    }
  }
  async load(filePath?: string) {
    const [organization, repo] = this.repo.split('/');
    const path = encodeURIComponent(filePath ?? this.path);
    const response = await fetch(
      `https://dev.azure.com/${organization}/_apis/git/repositories/${repo}/items?scopePath=${path}&includeContent=true&api-version=5.1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to load tokens');
    }
    const { value } = await response.json();
    console.log(value);
    return JSON.parse(value[0].content);
  }
}
