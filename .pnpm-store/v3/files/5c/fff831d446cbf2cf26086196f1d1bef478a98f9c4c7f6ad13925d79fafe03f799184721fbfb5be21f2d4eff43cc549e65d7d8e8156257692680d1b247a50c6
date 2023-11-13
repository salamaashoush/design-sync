'use strict';

const node_fs = require('node:fs');
const pathe = require('pathe');
const consola = require('consola');
const colorette = require('colorette');
const config = require('../shared/changelogen.f87bb008.cjs');
require('node:os');
require('ofetch');
require('scule');
require('convert-gitmoji');
require('node-fetch-native');
require('node:path');
require('c12');
require('pkg-types');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const consola__default = /*#__PURE__*/_interopDefaultCompat(consola);

async function githubMain(args) {
  const cwd = pathe.resolve(args.dir || "");
  process.chdir(cwd);
  const [subCommand, ..._versions] = args._;
  if (subCommand !== "release") {
    consola__default.log(
      "Usage: changelogen gh release [all|versions...] [--dir] [--token]"
    );
    process.exit(1);
  }
  const config$1 = await config.loadChangelogConfig(cwd, {});
  if (config$1.repo?.provider !== "github") {
    consola__default.error(
      "This command is only supported for github repository provider."
    );
    process.exit(1);
  }
  if (args.token) {
    config$1.tokens.github = args.token;
  }
  let changelogMd;
  if (typeof config$1.output === "string") {
    changelogMd = await node_fs.promises.readFile(pathe.resolve(config$1.output), "utf8").catch(() => null);
  }
  if (!changelogMd) {
    changelogMd = await config.getGithubChangelog(config$1).catch(() => null);
  }
  if (!changelogMd) {
    consola__default.error(`Cannot resolve CHANGELOG.md`);
    process.exit(1);
  }
  const changelogReleases = config.parseChangelogMarkdown(changelogMd).releases;
  let versions = [..._versions].map((v) => v.replace(/^v/, ""));
  if (versions[0] === "all") {
    versions = changelogReleases.map((r) => r.version).sort();
  } else if (versions.length === 0) {
    if (config$1.newVersion) {
      versions = [config$1.newVersion];
    } else if (changelogReleases.length > 0) {
      versions = [changelogReleases[0].version];
    }
  }
  if (versions.length === 0) {
    consola__default.error(`No versions specified to release!`);
    process.exit(1);
  }
  for (const version of versions) {
    const release = changelogReleases.find((r) => r.version === version);
    if (!release) {
      consola__default.warn(
        `No matching changelog entry found for ${version} in CHANGELOG.md. Skipping!`
      );
      continue;
    }
    if (!release.body || !release.version) {
      consola__default.warn(
        `Changelog entry for ${version} in CHANGELOG.md is missing body or version. Skipping!`
      );
      continue;
    }
    await githubRelease(config$1, {
      version: release.version,
      body: release.body
    });
  }
}
async function githubRelease(config$1, release) {
  if (!config$1.tokens.github) {
    config$1.tokens.github = await config.resolveGithubToken(config$1).catch(
      () => void 0
    );
  }
  const result = await config.syncGithubRelease(config$1, release);
  if (result.status === "manual") {
    if (result.error) {
      consola__default.error(result.error);
      process.exitCode = 1;
    }
    const open = await import('open').then((r) => r.default);
    await open(result.url).then(() => {
      consola__default.info(`Followup in the browser to manually create the release.`);
    }).catch(() => {
      consola__default.info(
        `Open this link to manually create a release: 
` + colorette.underline(colorette.cyan(result.url)) + "\n"
      );
    });
  } else {
    consola__default.success(
      `Synced ${colorette.cyan(`v${release.version}`)} to Github releases!`
    );
  }
}

exports.default = githubMain;
exports.githubRelease = githubRelease;
