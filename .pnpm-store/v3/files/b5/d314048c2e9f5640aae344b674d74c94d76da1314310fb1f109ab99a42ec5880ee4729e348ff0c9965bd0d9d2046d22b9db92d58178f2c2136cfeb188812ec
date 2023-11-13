'use strict';

const node_fs = require('node:fs');
const node_os = require('node:os');
const ofetch = require('ofetch');
const pathe = require('pathe');
const scule = require('scule');
const convertGitmoji = require('convert-gitmoji');
const nodeFetchNative = require('node-fetch-native');
const node_path = require('node:path');
const c12 = require('c12');
const pkgTypes = require('pkg-types');

async function execCommand(cmd, args, options) {
  const { execa } = await import('execa');
  const res = await execa(cmd, args, options);
  return res.stdout;
}

async function getLastGitTag() {
  const r = await execCommand("git", ["describe", "--tags", "--abbrev=0"]).then((r2) => r2.split("\n")).catch(() => []);
  return r.at(-1);
}
async function getCurrentGitBranch() {
  return await execCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
}
async function getCurrentGitTag() {
  return await execCommand("git", ["tag", "--points-at", "HEAD"]);
}
async function getCurrentGitRef() {
  return await getCurrentGitTag() || await getCurrentGitBranch();
}
async function getGitRemoteURL(cwd, remote = "origin") {
  return await execCommand("git", [
    `--work-tree=${cwd}`,
    "remote",
    "get-url",
    remote
  ]);
}
async function getCurrentGitStatus() {
  return await execCommand("git", ["status", "--porcelain"]);
}
async function getGitDiff(from, to = "HEAD") {
  const r = await execCommand("git", [
    "--no-pager",
    "log",
    `${from ? `${from}...` : ""}${to}`,
    '--pretty="----%n%s|%h|%an|%ae%n%b"',
    "--name-status"
  ]);
  return r.split("----\n").splice(1).map((line) => {
    const [firstLine, ..._body] = line.split("\n");
    const [message, shortHash, authorName, authorEmail] = firstLine.split("|");
    const r2 = {
      message,
      shortHash,
      author: { name: authorName, email: authorEmail },
      body: _body.join("\n")
    };
    return r2;
  });
}
function parseCommits(commits, config) {
  return commits.map((commit) => parseGitCommit(commit, config)).filter(Boolean);
}
const ConventionalCommitRegex = /(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;
const CoAuthoredByRegex = /co-authored-by:\s*(?<name>.+)(<(?<email>.+)>)/gim;
const PullRequestRE = /\([ a-z]*(#\d+)\s*\)/gm;
const IssueRE = /(#\d+)/gm;
function parseGitCommit(commit, config) {
  const match = commit.message.match(ConventionalCommitRegex);
  if (!match) {
    return null;
  }
  const type = match.groups.type;
  let scope = match.groups.scope || "";
  scope = config.scopeMap[scope] || scope;
  const isBreaking = Boolean(match.groups.breaking);
  let description = match.groups.description;
  const references = [];
  for (const m of description.matchAll(PullRequestRE)) {
    references.push({ type: "pull-request", value: m[1] });
  }
  for (const m of description.matchAll(IssueRE)) {
    if (!references.some((i) => i.value === m[1])) {
      references.push({ type: "issue", value: m[1] });
    }
  }
  references.push({ value: commit.shortHash, type: "hash" });
  description = description.replace(PullRequestRE, "").trim();
  const authors = [commit.author];
  for (const match2 of commit.body.matchAll(CoAuthoredByRegex)) {
    authors.push({
      name: (match2.groups.name || "").trim(),
      email: (match2.groups.email || "").trim()
    });
  }
  return {
    ...commit,
    authors,
    description,
    type,
    scope,
    references,
    isBreaking
  };
}

async function listGithubReleases(config) {
  return await githubFetch(config, `/repos/${config.repo.repo}/releases`, {
    query: { per_page: 100 }
  });
}
async function getGithubReleaseByTag(config, tag) {
  return await githubFetch(
    config,
    `/repos/${config.repo.repo}/releases/tags/${tag}`,
    {}
  );
}
async function getGithubChangelog(config) {
  return await githubFetch(
    config,
    `https://raw.githubusercontent.com/${config.repo.repo}/main/CHANGELOG.md`
  );
}
async function createGithubRelease(config, body) {
  return await githubFetch(config, `/repos/${config.repo.repo}/releases`, {
    method: "POST",
    body
  });
}
async function updateGithubRelease(config, id, body) {
  return await githubFetch(
    config,
    `/repos/${config.repo.repo}/releases/${id}`,
    {
      method: "PATCH",
      body
    }
  );
}
async function syncGithubRelease(config, release) {
  const currentGhRelease = await getGithubReleaseByTag(
    config,
    `v${release.version}`
  ).catch(() => {
  });
  const ghRelease = {
    tag_name: `v${release.version}`,
    name: `v${release.version}`,
    body: release.body
  };
  if (!config.tokens.github) {
    return {
      status: "manual",
      url: githubNewReleaseURL(config, release)
    };
  }
  try {
    const newGhRelease = await (currentGhRelease ? updateGithubRelease(config, currentGhRelease.id, ghRelease) : createGithubRelease(config, ghRelease));
    return {
      status: currentGhRelease ? "updated" : "created",
      id: newGhRelease.id
    };
  } catch (error) {
    return {
      status: "manual",
      error,
      url: githubNewReleaseURL(config, release)
    };
  }
}
function githubNewReleaseURL(config, release) {
  return `https://${config.repo.domain}/${config.repo.repo}/releases/new?tag=v${release.version}&title=v${release.version}&body=${encodeURIComponent(release.body)}`;
}
async function resolveGithubToken(config) {
  const env = process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (env) {
    return env;
  }
  const configHome = process.env.XDG_CONFIG_HOME || pathe.join(node_os.homedir(), ".config");
  const ghCLIPath = pathe.join(configHome, "gh", "hosts.yml");
  if (node_fs.existsSync(ghCLIPath)) {
    const yamlContents = await node_fs.promises.readFile(ghCLIPath, "utf8");
    const parseYAML = await import('yaml').then((r) => r.parse);
    const ghCLIConfig = parseYAML(yamlContents);
    if (ghCLIConfig && ghCLIConfig[config.repo.domain]) {
      return ghCLIConfig["github.com"].oauth_token;
    }
  }
}
async function githubFetch(config, url, opts = {}) {
  return await ofetch.$fetch(url, {
    ...opts,
    baseURL: config.repo.domain === "github.com" ? "https://api.github.com" : `https://${config.repo.domain}/api/v3`,
    headers: {
      ...opts.headers,
      authorization: config.tokens.github ? `Token ${config.tokens.github}` : void 0
    }
  });
}

const providerToRefSpec = {
  github: { "pull-request": "pull", hash: "commit", issue: "issues" },
  gitlab: { "pull-request": "merge_requests", hash: "commit", issue: "issues" },
  bitbucket: {
    "pull-request": "pull-requests",
    hash: "commit",
    issue: "issues"
  }
};
const providerToDomain = {
  github: "github.com",
  gitlab: "gitlab.com",
  bitbucket: "bitbucket.org"
};
const domainToProvider = {
  "github.com": "github",
  "gitlab.com": "gitlab",
  "bitbucket.org": "bitbucket"
};
const providerURLRegex = /^(?:(?<user>[\w-]+)@)?(?:(?<provider>[^/:]+):)?(?<repo>[\w-]+\/(?:\w|\.(?!git$)|-)+)(?:\.git)?$/;
function baseUrl(config) {
  return `https://${config.domain}/${config.repo}`;
}
function formatReference(ref, repo) {
  if (!repo || !(repo.provider in providerToRefSpec)) {
    return ref.value;
  }
  const refSpec = providerToRefSpec[repo.provider];
  return `[${ref.value}](${baseUrl(repo)}/${refSpec[ref.type]}/${ref.value.replace(/^#/, "")})`;
}
function formatCompareChanges(v, config) {
  const part = config.repo.provider === "bitbucket" ? "branches/compare" : "compare";
  return `[compare changes](${baseUrl(config.repo)}/${part}/${config.from}...${v || config.to})`;
}
async function resolveRepoConfig(cwd) {
  const pkg = await pkgTypes.readPackageJSON(cwd).catch(() => {
  });
  if (pkg && pkg.repository) {
    const url = typeof pkg.repository === "string" ? pkg.repository : pkg.repository.url;
    return getRepoConfig(url);
  }
  const gitRemote = await getGitRemoteURL(cwd).catch(() => {
  });
  if (gitRemote) {
    return getRepoConfig(gitRemote);
  }
}
function getRepoConfig(repoUrl = "") {
  let provider;
  let repo;
  let domain;
  let url;
  try {
    url = new URL(repoUrl);
  } catch {
  }
  const m = repoUrl.match(providerURLRegex)?.groups ?? {};
  if (m.repo && m.provider) {
    repo = m.repo;
    provider = m.provider in domainToProvider ? domainToProvider[m.provider] : m.provider;
    domain = provider in providerToDomain ? providerToDomain[provider] : provider;
  } else if (url) {
    domain = url.hostname;
    repo = url.pathname.split("/").slice(1, 3).join("/").replace(/\.git$/, "");
    provider = domainToProvider[domain];
  } else if (m.repo) {
    repo = m.repo;
    provider = "github";
    domain = providerToDomain[provider];
  }
  return {
    provider,
    repo,
    domain
  };
}

async function generateMarkDown(commits, config) {
  const typeGroups = groupBy(commits, "type");
  const markdown = [];
  const breakingChanges = [];
  const v = config.newVersion && `v${config.newVersion}`;
  markdown.push("", "## " + (v || `${config.from || ""}...${config.to}`), "");
  if (config.repo && config.from) {
    markdown.push(formatCompareChanges(v, config));
  }
  for (const type in config.types) {
    const group = typeGroups[type];
    if (!group || group.length === 0) {
      continue;
    }
    markdown.push("", "### " + config.types[type].title, "");
    for (const commit of group.reverse()) {
      const line = formatCommit(commit, config);
      markdown.push(line);
      if (commit.isBreaking) {
        breakingChanges.push(line);
      }
    }
  }
  if (breakingChanges.length > 0) {
    markdown.push("", "#### \u26A0\uFE0F Breaking Changes", "", ...breakingChanges);
  }
  const _authors = /* @__PURE__ */ new Map();
  for (const commit of commits) {
    if (!commit.author) {
      continue;
    }
    const name = formatName(commit.author.name);
    if (!name || name.includes("[bot]")) {
      continue;
    }
    if (config.excludeAuthors && config.excludeAuthors.some(
      (v2) => name.includes(v2) || commit.author.email?.includes(v2)
    )) {
      continue;
    }
    if (_authors.has(name)) {
      const entry = _authors.get(name);
      entry.email.add(commit.author.email);
    } else {
      _authors.set(name, { email: /* @__PURE__ */ new Set([commit.author.email]) });
    }
  }
  await Promise.all(
    [..._authors.keys()].map(async (authorName) => {
      const meta = _authors.get(authorName);
      for (const email of meta.email) {
        const { user } = await nodeFetchNative.fetch(`https://ungh.cc/users/find/${email}`).then((r) => r.json()).catch(() => ({ user: null }));
        if (user) {
          meta.github = user.username;
          break;
        }
      }
    })
  );
  const authors = [..._authors.entries()].map((e) => ({ name: e[0], ...e[1] }));
  if (authors.length > 0) {
    markdown.push(
      "",
      "### \u2764\uFE0F Contributors",
      "",
      ...authors.map((i) => {
        const _email = [...i.email].find(
          (e) => !e.includes("noreply.github.com")
        );
        const email = _email ? `<${_email}>` : "";
        const github = i.github ? `([@${i.github}](http://github.com/${i.github}))` : "";
        return `- ${i.name} ${github || email}`;
      })
    );
  }
  return convertGitmoji.convert(markdown.join("\n").trim(), true);
}
function parseChangelogMarkdown(contents) {
  const headings = [...contents.matchAll(CHANGELOG_RELEASE_HEAD_RE)];
  const releases = [];
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const nextHeading = headings[i + 1];
    const [, title] = heading;
    const version = title.match(VERSION_RE);
    const release = {
      version: version ? version[1] : void 0,
      body: contents.slice(
        heading.index + heading[0].length,
        nextHeading?.index ?? contents.length
      ).trim()
    };
    releases.push(release);
  }
  return {
    releases
  };
}
function formatCommit(commit, config) {
  return "- " + (commit.scope ? `**${commit.scope.trim()}:** ` : "") + (commit.isBreaking ? "\u26A0\uFE0F  " : "") + scule.upperFirst(commit.description) + formatReferences(commit.references, config);
}
function formatReferences(references, config) {
  const pr = references.filter((ref) => ref.type === "pull-request");
  const issue = references.filter((ref) => ref.type === "issue");
  if (pr.length > 0 || issue.length > 0) {
    return " (" + [...pr, ...issue].map((ref) => formatReference(ref, config.repo)).join(", ") + ")";
  }
  if (references.length > 0) {
    return " (" + formatReference(references[0], config.repo) + ")";
  }
  return "";
}
function formatName(name = "") {
  return name.split(" ").map((p) => scule.upperFirst(p.trim())).join(" ");
}
function groupBy(items, key) {
  const groups = {};
  for (const item of items) {
    groups[item[key]] = groups[item[key]] || [];
    groups[item[key]].push(item);
  }
  return groups;
}
const CHANGELOG_RELEASE_HEAD_RE = /^#{2,}\s+.*(v?(\d+\.\d+\.\d+)).*$/gm;
const VERSION_RE = /^v?(\d+\.\d+\.\d+)$/;

const defaultOutput = "CHANGELOG.md";
const getDefaultConfig = () => ({
  types: {
    feat: { title: "\u{1F680} Enhancements", semver: "minor" },
    perf: { title: "\u{1F525} Performance", semver: "patch" },
    fix: { title: "\u{1FA79} Fixes", semver: "patch" },
    refactor: { title: "\u{1F485} Refactors", semver: "patch" },
    docs: { title: "\u{1F4D6} Documentation", semver: "patch" },
    build: { title: "\u{1F4E6} Build", semver: "patch" },
    types: { title: "\u{1F30A} Types", semver: "patch" },
    chore: { title: "\u{1F3E1} Chore" },
    examples: { title: "\u{1F3C0} Examples" },
    test: { title: "\u2705 Tests" },
    style: { title: "\u{1F3A8} Styles" },
    ci: { title: "\u{1F916} CI" }
  },
  cwd: null,
  from: "",
  to: "",
  output: defaultOutput,
  scopeMap: {},
  tokens: {
    github: process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  },
  publish: {
    private: false,
    tag: "latest",
    args: []
  },
  templates: {
    commitMessage: "chore(release): v{{newVersion}}",
    tagMessage: "v{{newVersion}}",
    tagBody: "v{{newVersion}}"
  },
  excludeAuthors: []
});
async function loadChangelogConfig(cwd, overrides) {
  await c12.setupDotenv({ cwd });
  const defaults = getDefaultConfig();
  const { config } = await c12.loadConfig({
    cwd,
    name: "changelog",
    packageJson: true,
    defaults,
    overrides: {
      cwd,
      ...overrides
    }
  });
  return await resolveChangelogConfig(config, cwd);
}
async function resolveChangelogConfig(config, cwd) {
  if (!config.from) {
    config.from = await getLastGitTag();
  }
  if (!config.to) {
    config.to = await getCurrentGitRef();
  }
  if (config.output) {
    config.output = config.output === true ? defaultOutput : node_path.resolve(cwd, config.output);
  } else {
    config.output = false;
  }
  if (!config.repo) {
    config.repo = await resolveRepoConfig(cwd);
  }
  if (typeof config.repo === "string") {
    config.repo = getRepoConfig(config.repo);
  }
  return config;
}

exports.createGithubRelease = createGithubRelease;
exports.execCommand = execCommand;
exports.formatCompareChanges = formatCompareChanges;
exports.formatReference = formatReference;
exports.generateMarkDown = generateMarkDown;
exports.getCurrentGitBranch = getCurrentGitBranch;
exports.getCurrentGitRef = getCurrentGitRef;
exports.getCurrentGitStatus = getCurrentGitStatus;
exports.getCurrentGitTag = getCurrentGitTag;
exports.getGitDiff = getGitDiff;
exports.getGitRemoteURL = getGitRemoteURL;
exports.getGithubChangelog = getGithubChangelog;
exports.getGithubReleaseByTag = getGithubReleaseByTag;
exports.getLastGitTag = getLastGitTag;
exports.getRepoConfig = getRepoConfig;
exports.githubNewReleaseURL = githubNewReleaseURL;
exports.listGithubReleases = listGithubReleases;
exports.loadChangelogConfig = loadChangelogConfig;
exports.parseChangelogMarkdown = parseChangelogMarkdown;
exports.parseCommits = parseCommits;
exports.parseGitCommit = parseGitCommit;
exports.resolveChangelogConfig = resolveChangelogConfig;
exports.resolveGithubToken = resolveGithubToken;
exports.resolveRepoConfig = resolveRepoConfig;
exports.syncGithubRelease = syncGithubRelease;
exports.updateGithubRelease = updateGithubRelease;
