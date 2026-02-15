import { TokensManager, logger } from "@design-sync/manager";
import { defineCommand } from "citty";
import { handleCommandError } from "../utils/errors";

export default defineCommand({
  meta: {
    name: "sync",
    description: "Sync tokens from the git repo",
  },
  args: {
    uri: {
      type: "positional",
      description: "git repo url",
      valueHint: "gh:username/repo/path/to/files#branch",
      required: false,
    },
    out: {
      type: "string",
      description: "path to output file",
    },
    config: {
      type: "string",
      description: "path to config file",
    },
    auth: {
      type: "string",
      description: "git provider auth token",
    },
    cwd: {
      type: "string",
      description: "path to working directory",
    },
    prettify: {
      type: "boolean",
      description: "prettify output",
    },
  },
  async run({ args }) {
    try {
      const tokensManager = new TokensManager();
      await tokensManager.run(args);
    } catch (error) {
      handleCommandError(error, logger);
    }
  },
});
