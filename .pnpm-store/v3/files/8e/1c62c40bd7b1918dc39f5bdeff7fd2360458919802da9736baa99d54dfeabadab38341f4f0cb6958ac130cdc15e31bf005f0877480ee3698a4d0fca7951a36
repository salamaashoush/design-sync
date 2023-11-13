import { existsSync, promises } from 'node:fs';
import { resolve } from 'pathe';
import consola from 'consola';
import { execa } from 'execa';
import { r as renamePackage, b as bumpVersion, n as npmPublish } from '../shared/changelogen.a1f9ff93.mjs';
import { githubRelease } from './github.mjs';
import { l as loadChangelogConfig, g as getCurrentGitStatus, a as getGitDiff, p as parseCommits, b as generateMarkDown } from '../shared/changelogen.b98c84ee.mjs';
import 'semver';
import 'pkg-types';
import 'std-env';
import 'colorette';
import 'node:os';
import 'ofetch';
import 'scule';
import 'convert-gitmoji';
import 'node-fetch-native';
import 'node:path';
import 'c12';

async function defaultMain(args) {
  const cwd = resolve(args._[0] || args.dir || "");
  process.chdir(cwd);
  consola.wrapConsole();
  const config = await loadChangelogConfig(cwd, {
    from: args.from,
    to: args.to,
    output: args.output,
    newVersion: typeof args.r === "string" ? args.r : void 0
  });
  if (args.clean) {
    const dirty = await getCurrentGitStatus();
    if (dirty) {
      consola.error("Working directory is not clean.");
      process.exit(1);
    }
  }
  const logger = consola.create({ stdout: process.stderr });
  logger.info(`Generating changelog for ${config.from || ""}...${config.to}`);
  const rawCommits = await getGitDiff(config.from, config.to);
  const commits = parseCommits(rawCommits, config).filter(
    (c) => config.types[c.type] && !(c.type === "chore" && c.scope === "deps" && !c.isBreaking)
  );
  if (args.canary) {
    if (args.bump === void 0) {
      args.bump = true;
    }
    if (args.versionSuffix === void 0) {
      args.versionSuffix = true;
    }
    if (args.nameSuffix === void 0 && typeof args.canary === "string") {
      args.nameSuffix = args.canary;
    }
  }
  if (typeof args.nameSuffix === "string") {
    await renamePackage(config, `-${args.nameSuffix}`);
  }
  if (args.bump || args.release) {
    const bumpOptions = _getBumpVersionOptions(args);
    const newVersion = await bumpVersion(commits, config, bumpOptions);
    if (!newVersion) {
      consola.error("Unable to bump version based on changes.");
      process.exit(1);
    }
    config.newVersion = newVersion;
  }
  const markdown = await generateMarkDown(commits, config);
  const displayOnly = !args.bump && !args.release;
  if (displayOnly) {
    consola.log("\n\n" + markdown + "\n\n");
  }
  if (typeof config.output === "string" && (args.output || !displayOnly)) {
    let changelogMD;
    if (existsSync(config.output)) {
      consola.info(`Updating ${config.output}`);
      changelogMD = await promises.readFile(config.output, "utf8");
    } else {
      consola.info(`Creating  ${config.output}`);
      changelogMD = "# Changelog\n\n";
    }
    const lastEntry = changelogMD.match(/^###?\s+.*$/m);
    if (lastEntry) {
      changelogMD = changelogMD.slice(0, lastEntry.index) + markdown + "\n\n" + changelogMD.slice(lastEntry.index);
    } else {
      changelogMD += "\n" + markdown + "\n\n";
    }
    await promises.writeFile(config.output, changelogMD);
  }
  if (args.release) {
    if (args.commit !== false) {
      const filesToAdd = [config.output, "package.json"].filter(
        (f) => f && typeof f === "string"
      );
      await execa("git", ["add", ...filesToAdd], { cwd });
      const msg = config.templates.commitMessage.replaceAll(
        "{{newVersion}}",
        config.newVersion
      );
      await execa("git", ["commit", "-m", msg], { cwd });
    }
    if (args.tag !== false) {
      const msg = config.templates.tagMessage.replaceAll(
        "{{newVersion}}",
        config.newVersion
      );
      const body = config.templates.tagBody.replaceAll(
        "{{newVersion}}",
        config.newVersion
      );
      await execa("git", ["tag", "-am", msg, body], { cwd });
    }
    if (args.push === true) {
      await execa("git", ["push", "--follow-tags"], { cwd });
    }
    if (args.github !== false && config.repo?.provider === "github") {
      await githubRelease(config, {
        version: config.newVersion,
        body: markdown.split("\n").slice(2).join("\n")
      });
    }
  }
  if (args.publish) {
    if (args.publishTag) {
      config.publish.tag = args.publishTag;
    }
    await npmPublish(config);
  }
}
function _getBumpVersionOptions(args) {
  if (args.versionSuffix) {
    return {
      suffix: args.versionSuffix
    };
  }
  for (const type of [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
  ]) {
    const value = args[type];
    if (value) {
      if (type.startsWith("pre")) {
        return {
          type,
          preid: typeof value === "string" ? value : ""
        };
      }
      return {
        type
      };
    }
  }
}

export { defaultMain as default };
