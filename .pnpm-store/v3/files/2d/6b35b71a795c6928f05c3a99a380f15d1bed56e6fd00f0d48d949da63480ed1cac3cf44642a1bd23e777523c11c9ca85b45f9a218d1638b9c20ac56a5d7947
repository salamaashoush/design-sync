'use strict';

const node_fs = require('node:fs');
const pathe = require('pathe');
const consola = require('consola');
const execa = require('execa');
const index = require('../shared/changelogen.ba4d3fcf.cjs');
const github = require('./github.cjs');
const config = require('../shared/changelogen.f87bb008.cjs');
require('semver');
require('pkg-types');
require('std-env');
require('colorette');
require('node:os');
require('ofetch');
require('scule');
require('convert-gitmoji');
require('node-fetch-native');
require('node:path');
require('c12');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const consola__default = /*#__PURE__*/_interopDefaultCompat(consola);

async function defaultMain(args) {
  const cwd = pathe.resolve(args._[0] || args.dir || "");
  process.chdir(cwd);
  consola__default.wrapConsole();
  const config$1 = await config.loadChangelogConfig(cwd, {
    from: args.from,
    to: args.to,
    output: args.output,
    newVersion: typeof args.r === "string" ? args.r : void 0
  });
  if (args.clean) {
    const dirty = await config.getCurrentGitStatus();
    if (dirty) {
      consola__default.error("Working directory is not clean.");
      process.exit(1);
    }
  }
  const logger = consola__default.create({ stdout: process.stderr });
  logger.info(`Generating changelog for ${config$1.from || ""}...${config$1.to}`);
  const rawCommits = await config.getGitDiff(config$1.from, config$1.to);
  const commits = config.parseCommits(rawCommits, config$1).filter(
    (c) => config$1.types[c.type] && !(c.type === "chore" && c.scope === "deps" && !c.isBreaking)
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
    await index.renamePackage(config$1, `-${args.nameSuffix}`);
  }
  if (args.bump || args.release) {
    const bumpOptions = _getBumpVersionOptions(args);
    const newVersion = await index.bumpVersion(commits, config$1, bumpOptions);
    if (!newVersion) {
      consola__default.error("Unable to bump version based on changes.");
      process.exit(1);
    }
    config$1.newVersion = newVersion;
  }
  const markdown = await config.generateMarkDown(commits, config$1);
  const displayOnly = !args.bump && !args.release;
  if (displayOnly) {
    consola__default.log("\n\n" + markdown + "\n\n");
  }
  if (typeof config$1.output === "string" && (args.output || !displayOnly)) {
    let changelogMD;
    if (node_fs.existsSync(config$1.output)) {
      consola__default.info(`Updating ${config$1.output}`);
      changelogMD = await node_fs.promises.readFile(config$1.output, "utf8");
    } else {
      consola__default.info(`Creating  ${config$1.output}`);
      changelogMD = "# Changelog\n\n";
    }
    const lastEntry = changelogMD.match(/^###?\s+.*$/m);
    if (lastEntry) {
      changelogMD = changelogMD.slice(0, lastEntry.index) + markdown + "\n\n" + changelogMD.slice(lastEntry.index);
    } else {
      changelogMD += "\n" + markdown + "\n\n";
    }
    await node_fs.promises.writeFile(config$1.output, changelogMD);
  }
  if (args.release) {
    if (args.commit !== false) {
      const filesToAdd = [config$1.output, "package.json"].filter(
        (f) => f && typeof f === "string"
      );
      await execa.execa("git", ["add", ...filesToAdd], { cwd });
      const msg = config$1.templates.commitMessage.replaceAll(
        "{{newVersion}}",
        config$1.newVersion
      );
      await execa.execa("git", ["commit", "-m", msg], { cwd });
    }
    if (args.tag !== false) {
      const msg = config$1.templates.tagMessage.replaceAll(
        "{{newVersion}}",
        config$1.newVersion
      );
      const body = config$1.templates.tagBody.replaceAll(
        "{{newVersion}}",
        config$1.newVersion
      );
      await execa.execa("git", ["tag", "-am", msg, body], { cwd });
    }
    if (args.push === true) {
      await execa.execa("git", ["push", "--follow-tags"], { cwd });
    }
    if (args.github !== false && config$1.repo?.provider === "github") {
      await github.githubRelease(config$1, {
        version: config$1.newVersion,
        body: markdown.split("\n").slice(2).join("\n")
      });
    }
  }
  if (args.publish) {
    if (args.publishTag) {
      config$1.publish.tag = args.publishTag;
    }
    await index.npmPublish(config$1);
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

exports.default = defaultMain;
