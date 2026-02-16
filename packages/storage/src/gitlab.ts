import { GitStorage, PullRequestOptions, PullRequestResult, SaveFileOptions } from "./git";

// Gitlab using the fetch api
export class GitlabStorage extends GitStorage {
  get baseUrl() {
    return this.apiUrl ?? "https://gitlab.com";
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      "Private-Token": this.accessToken,
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
    const response = await fetch(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/repository/commits`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          id: this.projectId,
          branch: b,
          commit_message: commitMessage,
          actions,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to save tokens");
    }
  }

  async load(filePath?: string): Promise<any> {
    const path = encodeURIComponent(filePath ?? this.path);
    const branch = encodeURIComponent(this.ref);
    const response = await fetch(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/repository/files/${path}/raw?ref=${branch}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to load tokens");
    }
    const data = await response.json();
    return data;
  }

  async listBranches(): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/repository/branches?per_page=100`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to list branches");
    }
    const branches: Array<{ name: string }> = await response.json();
    return branches.map((b) => b.name);
  }

  async createBranch(name: string, fromRef?: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/repository/branches`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          branch: name,
          ref: fromRef ?? this.ref,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to create branch ${name}`);
    }
  }

  async createPullRequest(options: PullRequestOptions): Promise<PullRequestResult> {
    const response = await fetch(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/merge_requests`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          title: options.title,
          description: options.description ?? "",
          source_branch: options.sourceBranch,
          target_branch: options.targetBranch,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create merge request");
    }
    const mr = await response.json();
    return { url: mr.web_url, id: mr.iid };
  }

  async listFiles(dir: string): Promise<string[]> {
    const path = encodeURIComponent(dir);
    const response = await fetch(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/repository/tree?path=${path}&ref=${this.ref}&per_page=100`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to list files");
    }
    const data: Array<{ name: string; path: string; type: string }> = await response.json();
    return data.filter((f) => f.type === "blob").map((f) => f.path);
  }

  async saveBatch(
    files: Array<{ path: string; content: string }>,
    { commitMessage, branch }: SaveFileOptions,
  ): Promise<void> {
    const b = branch || this.ref;
    const actions = await Promise.all(
      files.map(async (file) => ({
        action: (await this.exists(file.path)) ? "update" : "create",
        file_path: file.path,
        content: file.content,
      })),
    );
    const response = await fetch(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/repository/commits`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          branch: b,
          commit_message: commitMessage,
          actions,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to save batch");
    }
  }

  async loadBatch(paths: string[]): Promise<Array<{ path: string; content: any }>> {
    return Promise.all(
      paths.map(async (path) => ({
        path,
        content: await this.load(path),
      })),
    );
  }
}
