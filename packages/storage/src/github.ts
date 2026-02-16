import { GitStorage, PullRequestOptions, PullRequestResult, SaveFileOptions } from "./git";
interface GithubFile {
  type: "file";
  encoding: "base64";
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
  get baseUrl() {
    return this.apiUrl ?? "https://api.github.com";
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Accept: "application/vnd.github.raw",
      Authorization: `token ${this.accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  private async getSha(path: string) {
    const data = await this.fetchContent(path);
    if (Array.isArray(data)) {
      const parentPath = path.split("/").slice(0, -1).join("/");
      const parent = await this.fetchContent(parentPath);
      return Array.isArray(parent) ? parent.find((f) => f.path === path)?.sha : parent.sha;
    }
    return data.sha;
  }

  private async fetchContent(path: string): Promise<GithubFile> {
    const response = await fetch(
      `${this.baseUrl}/repos/${this.repo}/contents/${path}?ref=${this.ref}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    // throw for non 200 status codes
    if (!response.ok) {
      throw new Error("Failed to load tokens");
    }
    return response.json();
  }

  async save(tokens: any, { commitMessage, filePath }: SaveFileOptions): Promise<void> {
    const sha = await this.getSha(filePath);
    const response = await fetch(`${this.baseUrl}/repos/${this.repo}/contents/${filePath}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({
        branch: this.ref,
        message: commitMessage,
        committer: {
          name: "DesignSync",
          email: "designsync@users.noreply.github.com",
        },
        sha,
        content: this.base64.encode(JSON.stringify(tokens)),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to save tokens");
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

  async listBranches(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/repos/${this.repo}/branches?per_page=100`, {
      method: "GET",
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error("Failed to list branches");
    }
    const branches: Array<{ name: string }> = await response.json();
    return branches.map((b) => b.name);
  }

  async createBranch(name: string, fromRef?: string): Promise<void> {
    // Get SHA of source ref
    const ref = fromRef ?? this.ref;
    const refResponse = await fetch(`${this.baseUrl}/repos/${this.repo}/git/ref/heads/${ref}`, {
      method: "GET",
      headers: this.headers,
    });
    if (!refResponse.ok) {
      throw new Error(`Failed to get ref ${ref}`);
    }
    const refData = await refResponse.json();
    const sha = refData.object.sha;

    const response = await fetch(`${this.baseUrl}/repos/${this.repo}/git/refs`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        ref: `refs/heads/${name}`,
        sha,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create branch ${name}`);
    }
  }

  async createPullRequest(options: PullRequestOptions): Promise<PullRequestResult> {
    const response = await fetch(`${this.baseUrl}/repos/${this.repo}/pulls`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        title: options.title,
        body: options.description ?? "",
        head: options.sourceBranch,
        base: options.targetBranch,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create pull request");
    }
    const pr = await response.json();
    return { url: pr.html_url, id: pr.number };
  }

  async listFiles(dir: string): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/repos/${this.repo}/contents/${dir}?ref=${this.ref}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to list files");
    }
    const data: Array<{ name: string; path: string; type: string }> = await response.json();
    return data.filter((f) => f.type === "file").map((f) => f.path);
  }

  async saveBatch(
    files: Array<{ path: string; content: string }>,
    { commitMessage }: SaveFileOptions,
  ): Promise<void> {
    // Use Git Trees API for multi-file commits
    // 1. Get current commit SHA
    const refResponse = await fetch(
      `${this.baseUrl}/repos/${this.repo}/git/ref/heads/${this.ref}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );
    if (!refResponse.ok) throw new Error("Failed to get ref");
    const refData = await refResponse.json();
    const commitSha = refData.object.sha;

    // 2. Create blobs for each file
    const tree = await Promise.all(
      files.map(async (file) => {
        const blobRes = await fetch(`${this.baseUrl}/repos/${this.repo}/git/blobs`, {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({ content: file.content, encoding: "utf-8" }),
        });
        if (!blobRes.ok) throw new Error(`Failed to create blob for ${file.path}`);
        const blob = await blobRes.json();
        return {
          path: file.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: blob.sha,
        };
      }),
    );

    // 3. Create tree
    const treeRes = await fetch(`${this.baseUrl}/repos/${this.repo}/git/trees`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ base_tree: commitSha, tree }),
    });
    if (!treeRes.ok) throw new Error("Failed to create tree");
    const treeData = await treeRes.json();

    // 4. Create commit
    const commitRes = await fetch(`${this.baseUrl}/repos/${this.repo}/git/commits`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        message: commitMessage,
        tree: treeData.sha,
        parents: [commitSha],
      }),
    });
    if (!commitRes.ok) throw new Error("Failed to create commit");
    const newCommit = await commitRes.json();

    // 5. Update ref
    const updateRes = await fetch(`${this.baseUrl}/repos/${this.repo}/git/refs/heads/${this.ref}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ sha: newCommit.sha }),
    });
    if (!updateRes.ok) throw new Error("Failed to update ref");
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
