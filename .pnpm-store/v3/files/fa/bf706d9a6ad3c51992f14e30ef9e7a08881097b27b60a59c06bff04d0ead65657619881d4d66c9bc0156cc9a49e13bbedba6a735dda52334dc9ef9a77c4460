'use strict';

const config = require('./changelogen.f87bb008.cjs');
const semver = require('semver');
const consola = require('consola');
const pathe = require('pathe');
const pkgTypes = require('pkg-types');
const stdEnv = require('std-env');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const semver__default = /*#__PURE__*/_interopDefaultCompat(semver);
const consola__default = /*#__PURE__*/_interopDefaultCompat(consola);

function readPackageJSON(config) {
  const path = pathe.resolve(config.cwd, "package.json");
  return pkgTypes.readPackageJSON(path);
}
function writePackageJSON(config, pkg) {
  const path = pathe.resolve(config.cwd, "package.json");
  return pkgTypes.writePackageJSON(path, pkg);
}
async function renamePackage(config, newName) {
  const pkg = await readPackageJSON(config);
  if (newName.startsWith("-")) {
    if (pkg.name.endsWith(newName)) {
      return;
    }
    newName = pkg.name + newName;
  }
  consola__default.info(`Renaming npm package from \`${pkg.name}\` to \`${newName}\``);
  pkg.name = newName;
  await writePackageJSON(config, pkg);
}
async function npmPublish(config$1) {
  const pkg = await readPackageJSON(config$1);
  const args = [...config$1.publish.args];
  if (!config$1.publish.private && !pkg.private) {
    args.push("--access", "public");
  }
  if (config$1.publish.tag) {
    args.push("--tag", config$1.publish.tag);
  }
  if (stdEnv.isCI && stdEnv.provider === "github_actions" && process.env.NPM_CONFIG_PROVENANCE !== "false") {
    args.push("--provenance");
  }
  return await config.execCommand("npm", ["publish", ...args]);
}

function determineSemverChange(commits, config) {
  let [hasMajor, hasMinor, hasPatch] = [false, false, false];
  for (const commit of commits) {
    const semverType = config.types[commit.type]?.semver;
    if (semverType === "major" || commit.isBreaking) {
      hasMajor = true;
    } else if (semverType === "minor") {
      hasMinor = true;
    } else if (semverType === "patch") {
      hasPatch = true;
    }
  }
  return hasMajor ? "major" : hasMinor ? "minor" : hasPatch ? "patch" : null;
}
async function bumpVersion(commits, config, opts = {}) {
  let type = opts.type || determineSemverChange(commits, config) || "patch";
  const originalType = type;
  const pkg = await readPackageJSON(config);
  const currentVersion = pkg.version || "0.0.0";
  if (currentVersion.startsWith("0.")) {
    if (type === "major") {
      type = "minor";
    } else if (type === "minor") {
      type = "patch";
    }
  }
  if (config.newVersion) {
    pkg.version = config.newVersion;
  } else if (type || opts.preid) {
    pkg.version = semver__default.inc(currentVersion, type, opts.preid);
    config.newVersion = pkg.version;
  }
  if (opts.suffix) {
    const suffix = typeof opts.suffix === "string" ? `-${opts.suffix}` : `-${Math.round(Date.now() / 1e3)}.${commits[0].shortHash}`;
    pkg.version = config.newVersion = config.newVersion.split("-")[0] + suffix;
  }
  if (pkg.version === currentVersion) {
    return false;
  }
  consola__default.info(
    `Bumping npm package version from \`${currentVersion}\` to \`${pkg.version}\` (${originalType})`
  );
  await writePackageJSON(config, pkg);
  return pkg.version;
}

exports.bumpVersion = bumpVersion;
exports.determineSemverChange = determineSemverChange;
exports.npmPublish = npmPublish;
exports.renamePackage = renamePackage;
