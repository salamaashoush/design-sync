import { GitStorage, PullRequestOptions, PullRequestResult, SaveFileOptions } from "./git";

export class BitbucketStorage extends GitStorage {
  get baseUrl() {
    return this.apiUrl ?? "https://api.bitbucket.org";
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Basic ${this.accessToken}`,
    };
  }

  private get projectId() {
    return encodeURIComponent(this.repo);
  }

  async exists(filePath: string): Promise<boolean> {
    return this.load(filePath)
      .then(() => true)
      .catch(() => false);
  }

  async save(tokens: any, { commitMessage, filePath, branch }: SaveFileOptions): Promise<void> {
    const b = branch || this.ref;
    const exists = await this.exists(filePath);
    const content = JSON.stringify(tokens, null, 2);
    const actions = [
      {
        action: exists ? "update" : "create",
        file_path: filePath,
        content,
      },
    ];
    const response = await fetch(`${this.baseUrl}/2.0/repositories/${this.projectId}/src`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        id: this.projectId,
        branch: b,
        commit_message: commitMessage,
        actions,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to save tokens");
    }
  }

  async load(filePath?: string): Promise<any> {
    const path = encodeURIComponent(filePath ?? this.path);
    const branch = encodeURIComponent(this.ref);
    const response = await fetch(
      `${this.baseUrl}/2.0/repositories/${this.projectId}/src/${branch}/${path}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to load tokens");
    }
    return JSON.parse(await response.text());
  }

  async listBranches(): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/2.0/repositories/${this.projectId}/refs/branches?pagelen=100`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to list branches");
    }
    const data = await response.json();
    return (data.values as Array<{ name: string }>).map((b) => b.name);
  }

  async createBranch(name: string, fromRef?: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/2.0/repositories/${this.projectId}/refs/branches`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          name,
          target: { hash: fromRef ?? this.ref },
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to create branch ${name}`);
    }
  }

  async createPullRequest(options: PullRequestOptions): Promise<PullRequestResult> {
    const response = await fetch(
      `${this.baseUrl}/2.0/repositories/${this.projectId}/pullrequests`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          title: options.title,
          description: options.description ?? "",
          source: { branch: { name: options.sourceBranch } },
          destination: { branch: { name: options.targetBranch } },
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create pull request");
    }
    const pr = await response.json();
    return { url: pr.links.html.href, id: pr.id };
  }

  async listFiles(dir: string): Promise<string[]> {
    const path = encodeURIComponent(dir);
    const branch = encodeURIComponent(this.ref);
    const response = await fetch(
      `${this.baseUrl}/2.0/repositories/${this.projectId}/src/${branch}/${path}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to list files");
    }
    const data = await response.json();
    return (data.values as Array<{ path: string; type: string }>)
      .filter((f) => f.type === "commit_file")
      .map((f) => f.path);
  }
}
