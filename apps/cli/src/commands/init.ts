import { logger } from "@design-sync/manager";
import { camelCase } from "@design-sync/utils";
import { defineCommand } from "citty";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { addDevDependency, detectPackageManager } from "nypm";
import { CLIError, handleCommandError } from "../utils/errors";
export interface ConfigTemplateOptions {
  out: string;
  uri: string;
  plugins: string[];
  prettify: boolean;
}

export function generateCJSConfigTemplate({ out, uri, plugins, prettify }: ConfigTemplateOptions) {
  const pluginImports = plugins.map(
    (plugin) => `const ${camelCase(plugin)}Plugin = require('@design-sync/${plugin}-plugin');`,
  );
  const pluginCalls = plugins.map((plugin) => `${camelCase(plugin)}Plugin()`);
  return `const { defineConfig } = require('@design-sync/cli');
${pluginImports.join("\n")}

module.exports = defineConfig({
  uri:  "${uri}",
  out:  "${out}",
  plugins: [${pluginCalls.join(", ")}],
  prettify: ${prettify},
});`;
}

export function generateESMConfigTemplate({ out, uri, plugins, prettify }: ConfigTemplateOptions) {
  const pluginImports = plugins.map(
    (plugin) => `import { ${camelCase(plugin)}Plugin } from '@design-sync/${plugin}-plugin';`,
  );
  const pluginCalls = plugins.map((plugin) => `${camelCase(plugin)}Plugin()`);
  return `import { defineConfig } from '@design-sync/cli';
${pluginImports.join("\n")}

export default defineConfig({
  uri:  "${uri}",
  out:  "${out}",
  plugins: [${pluginCalls.join(", ")}],
  prettify: ${prettify},
});`;
}

export function generateConfigTemplate(options: ConfigTemplateOptions, isCJS: boolean) {
  return isCJS ? generateCJSConfigTemplate(options) : generateESMConfigTemplate(options);
}

async function addPackageJsonScript(
  packageJsonPath: string,
  scriptName: string,
  scriptCommand: string,
) {
  const content = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(content);
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts[scriptName] = scriptCommand;
  const updatedPackageJson = JSON.stringify(packageJson, null, 2);
  await writeFile(packageJsonPath, updatedPackageJson, "utf8");
}
async function configPrompt() {
  const uri = await logger.prompt("What is the uri of your tokens git repo?", {
    type: "text",
    placeholder: "gh:username/repo/path/to/tokens#branch",
    default: "gh:username/repo/path/to/tokens#branch",
  });

  const out = await logger.prompt("Where would you like to output your tokens?", {
    type: "text",
    placeholder: "src/design-sync",
    default: "src/design-sync",
  });

  const plugins = (await logger.prompt("Which plugin would you like to use?", {
    type: "multiselect",
    options: [
      "vanilla-extract",
      // 'styled-components',
      // 'emotion',
      // 'tailwindcss',
      // 'stitches',
      // 'css-modules',
      "css",
      "json",
      // 'typescript',
    ],
    initial: ["vanilla-extract"],
  })) as string[];

  const prettify = await logger.prompt("Would you like to format files using prettier?", {
    type: "confirm",
    initial: false,
  });

  return { uri, out, plugins, prettify };
}

export default defineCommand({
  meta: {
    name: "init",
    description: "Init design sync config",
  },
  args: {
    cwd: {
      type: "string",
      description: "path to cwd",
      default: process.cwd(),
    },
    default: {
      type: "boolean",
      description: "use default config",
      alias: "y",
      default: false,
    },
  },
  async run({ args }) {
    try {
      let config: ConfigTemplateOptions = {
        uri: "gh:username/repo/path/to/tokens#branch",
        out: "src/design-sync",
        plugins: ["json"],
        prettify: false,
      };

      if (!args.default) {
        config = await configPrompt();
      }
      const isCJS = typeof require !== "undefined";
      const isTypescript = existsSync(`${args.cwd}/tsconfig.json`);
      const template = generateConfigTemplate(config, isCJS);

      const deps = [
        "@design-sync/cli",
        ...config.plugins.map((plugin) => `@design-sync/${plugin}-plugin`),
      ];
      logger.start(`Installing dependencies ${deps.join(", ")} ...`);

      const packageManager = await detectPackageManager(args.cwd, {
        includeParentDirs: true,
      });

      if (!packageManager) {
        throw new CLIError(
          "Could not detect package manager. Please ensure you have a package.json file.",
        );
      }

      for (const dep of deps) {
        await addDevDependency(dep, { cwd: args.cwd, silent: true, packageManager });
        logger.success(`Installed ${dep}`);
      }

      const configPath = isTypescript ? "design-sync.config.ts" : "design-sync.config.js";
      await writeFile(join(args.cwd, configPath), template);
      logger.success(`Config file created at ${configPath}`);

      const pkgJsonPath = join(args.cwd, "package.json");
      try {
        await addPackageJsonScript(pkgJsonPath, "tokens:sync", "design-sync sync");
      } catch {
        logger.warn(
          `Failed to add tokens:sync script to package.json at ${pkgJsonPath}, please add manually`,
        );
      }

      logger.box(`You can now run \`${packageManager.command} run tokens:sync\``);
    } catch (error) {
      handleCommandError(error, logger);
    }
  },
});
