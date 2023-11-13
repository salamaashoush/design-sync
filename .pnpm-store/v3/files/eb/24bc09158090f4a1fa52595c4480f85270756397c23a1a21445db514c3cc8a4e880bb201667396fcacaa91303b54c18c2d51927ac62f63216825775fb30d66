import { e as execCommand } from './changelogen.b98c84ee.mjs';
import semver from 'semver';
import consola from 'consola';
import { resolve } from 'pathe';
import { readPackageJSON as readPackageJSON$1, writePackageJSON as writePackageJSON$1 } from 'pkg-types';
import { isCI, provider } from 'std-env';

function readPackageJSON(config) {
  const path = resolve(config.cwd, "package.json");
  return readPackageJSON$1(path);
}
function writePackageJSON(config, pkg) {
  const path = resolve(config.cwd, "package.json");
  return writePackageJSON$1(path, pkg);
}
async function renamePackage(config, newName) {
  const pkg = await readPackageJSON(config);
  if (newName.startsWith("-")) {
    if (pkg.name.endsWith(newName)) {
      return;
    }
    newName = pkg.name + newName;
  }
  consola.info(`Renaming npm package from \`${pkg.name}\` to \`${newName}\``);
  pkg.name = newName;
  await writePackageJSON(config, pkg);
}
async function npmPublish(config) {
  const pkg = await readPackageJSON(config);
  const args = [...config.publish.args];
  if (!config.publish.private && !pkg.private) {
    args.push("--access", "public");
  }
  if (config.publish.tag) {
    args.push("--tag", config.publish.tag);
  }
  if (isCI && provider === "github_actions" && process.env.NPM_CONFIG_PROVENANCE !== "false") {
    args.push("--provenance");
  }
  return await execCommand("npm", ["publish", ...args]);
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
    pkg.version = semver.inc(currentVersion, type, opts.preid);
    config.newVersion = pkg.version;
  }
  if (opts.suffix) {
    const suffix = typeof opts.suffix === "string" ? `-${opts.suffix}` : `-${Math.round(Date.now() / 1e3)}.${commits[0].shortHash}`;
    pkg.version = config.newVersion = config.newVersion.split("-")[0] + suffix;
  }
  if (pkg.version === currentVersion) {
    return false;
  }
  consola.info(
    `Bumping npm package version from \`${currentVersion}\` to \`${pkg.version}\` (${originalType})`
  );
  await writePackageJSON(config, pkg);
  return pkg.version;
}

export { bumpVersion as b, determineSemverChange as d, npmPublish as n, renamePackage as r };
