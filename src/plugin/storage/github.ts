import { GitStorage, SaveFileOptions } from "./git";

// Github using the fetch api
export class GithubStorage extends GitStorage {
  async save(
    tokens: any,
    { commitMessage, filePath }: SaveFileOptions
  ): Promise<void> {
    const response = await fetch(
      `https://api.github.com/repos/${this.options.repoPath}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${this.options.accessToken}`,
        },
        body: JSON.stringify({
          branch: this.options.branch,
          message: commitMessage,
          content: btoa(JSON.stringify(tokens)),
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to save tokens");
    }
  }

  async load(filePath: string): Promise<any> {
    const response = await fetch(
      `https://api.github.com/repos/${this.options.repoPath}/contents/${filePath}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${this.options.accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to load tokens");
    }
    return JSON.parse(atob((await response.json()).content));
  }
}
