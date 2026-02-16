import { GitStorage, PullRequestOptions, PullRequestResult, SaveFileOptions } from "./git";

export class AzureDevOpsStorage extends GitStorage {
  get baseUrl() {
    return this.apiUrl ?? "https://dev.azure.com";
  }

  private get organization() {
    return this.repo.split("/")[0];
  }

  private get repoName() {
    return this.repo.split("/")[1];
  }

  async exists(filePath: string): Promise<boolean> {
    return this.load(filePath)
      .then(() => true)
      .catch(() => false);
  }

  private getAuthHeader() {
    const pat = btoa(`:${this.accessToken}`);
    return `Basic ${pat}`;
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: this.getAuthHeader(),
    };
  }

  private async getRef(branch: string) {
    const filter = encodeURIComponent(`heads/${branch}`);
    const response = await fetch(
      `${this.baseUrl}/${this.organization}/_apis/git/repositories/${this.repoName}/refs?filter=${filter}&api-version=5.1`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to get ref");
    }
    const { value } = await response.json();
    return value[0];
  }

  async save(tokens: any, { commitMessage, filePath }: SaveFileOptions): Promise<void> {
    const exists = await this.exists(filePath);
    const ref = await this.getRef(this.ref);
    const response = await fetch(
      `${this.baseUrl}/${this.organization}/_apis/git/repositories/${this.repoName}/pushes?api-version=6.1-preview.2`,
      {
        method: "POST",
        headers: this.headers,
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
                  changeType: exists ? "edit" : "add",
                  item: {
                    path: filePath,
                  },
                  newContent: {
                    content: JSON.stringify(tokens, null, 2),
                    contentType: "rawtext",
                  },
                },
              ],
            },
          ],
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to save tokens");
    }
  }

  async load(filePath?: string) {
    const path = encodeURIComponent(filePath ?? this.path);
    const response = await fetch(
      `${this.baseUrl}/${this.organization}/_apis/git/repositories/${this.repoName}/items?scopePath=${path}&includeContent=true&api-version=5.1`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to load tokens");
    }
    const { value } = await response.json();
    return JSON.parse(value[0].content);
  }

  async listBranches(): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/${this.organization}/_apis/git/repositories/${this.repoName}/refs?filter=heads/&api-version=5.1`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to list branches");
    }
    const { value } = await response.json();
    return (value as Array<{ name: string }>).map((b) => b.name.replace("refs/heads/", ""));
  }

  async createBranch(name: string, fromRef?: string): Promise<void> {
    const ref = await this.getRef(fromRef ?? this.ref);
    const response = await fetch(
      `${this.baseUrl}/${this.organization}/_apis/git/repositories/${this.repoName}/refs?api-version=5.1`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify([
          {
            name: `refs/heads/${name}`,
            oldObjectId: "0000000000000000000000000000000000000000",
            newObjectId: ref.objectId,
          },
        ]),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to create branch ${name}`);
    }
  }

  async createPullRequest(options: PullRequestOptions): Promise<PullRequestResult> {
    const response = await fetch(
      `${this.baseUrl}/${this.organization}/_apis/git/repositories/${this.repoName}/pullrequests?api-version=6.0`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          title: options.title,
          description: options.description ?? "",
          sourceRefName: `refs/heads/${options.sourceBranch}`,
          targetRefName: `refs/heads/${options.targetBranch}`,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create pull request");
    }
    const pr = await response.json();
    return {
      url: `${this.baseUrl}/${this.organization}/_git/${this.repoName}/pullrequest/${pr.pullRequestId}`,
      id: pr.pullRequestId,
    };
  }

  async saveBatch(
    files: Array<{ path: string; content: string }>,
    { commitMessage }: SaveFileOptions,
  ): Promise<void> {
    const ref = await this.getRef(this.ref);
    const changes = await Promise.all(
      files.map(async (file) => ({
        changeType: (await this.exists(file.path)) ? "edit" : "add",
        item: { path: file.path },
        newContent: { content: file.content, contentType: "rawtext" },
      })),
    );
    const response = await fetch(
      `${this.baseUrl}/${this.organization}/_apis/git/repositories/${this.repoName}/pushes?api-version=6.1-preview.2`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          refUpdates: [{ name: ref.name, oldObjectId: ref.objectId }],
          commits: [{ comment: commitMessage, changes }],
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to save batch");
    }
  }
}
