type SemverBumpType = "major" | "premajor" | "minor" | "preminor" | "patch" | "prepatch" | "prerelease";
declare function determineSemverChange(commits: GitCommit[], config: ChangelogConfig): SemverBumpType | null;
type BumpVersionOptions = {
    type?: SemverBumpType;
    preid?: string;
    suffix?: boolean;
};
declare function bumpVersion(commits: GitCommit[], config: ChangelogConfig, opts?: BumpVersionOptions): Promise<string | false>;

type RepoProvider = "github" | "gitlab" | "bitbucket";
type RepoConfig = {
    domain?: string;
    repo?: string;
    provider?: RepoProvider;
    token?: string;
};
declare function formatReference(ref: Reference, repo?: RepoConfig): string;
declare function formatCompareChanges(v: string, config: ResolvedChangelogConfig): string;
declare function resolveRepoConfig(cwd: string): Promise<RepoConfig>;
declare function getRepoConfig(repoUrl?: string): RepoConfig;

interface ChangelogConfig {
    cwd: string;
    types: Record<string, {
        title: string;
        semver?: SemverBumpType;
    }>;
    scopeMap: Record<string, string>;
    repo?: RepoConfig | string;
    tokens: Partial<Record<RepoProvider, string>>;
    from: string;
    to: string;
    newVersion?: string;
    output: string | boolean;
    publish: {
        args?: string[];
        tag?: string;
        private?: boolean;
    };
    templates: {
        commitMessage?: string;
        tagMessage?: string;
        tagBody?: string;
    };
    excludeAuthors: string[];
}
type ResolvedChangelogConfig = Omit<ChangelogConfig, "repo"> & {
    repo: RepoConfig;
};
declare function loadChangelogConfig(cwd: string, overrides?: Partial<ChangelogConfig>): Promise<ResolvedChangelogConfig>;
declare function resolveChangelogConfig(config: ChangelogConfig, cwd: string): Promise<ResolvedChangelogConfig>;

interface GitCommitAuthor {
    name: string;
    email: string;
}
interface RawGitCommit {
    message: string;
    body: string;
    shortHash: string;
    author: GitCommitAuthor;
}
interface Reference {
    type: "hash" | "issue" | "pull-request";
    value: string;
}
interface GitCommit extends RawGitCommit {
    description: string;
    type: string;
    scope: string;
    references: Reference[];
    authors: GitCommitAuthor[];
    isBreaking: boolean;
}
declare function getLastGitTag(): Promise<any>;
declare function getCurrentGitBranch(): Promise<string & Buffer>;
declare function getCurrentGitTag(): Promise<string & Buffer>;
declare function getCurrentGitRef(): Promise<string & Buffer>;
declare function getGitRemoteURL(cwd: string, remote?: string): Promise<string & Buffer>;
declare function getCurrentGitStatus(): Promise<string & Buffer>;
declare function getGitDiff(from: string | undefined, to?: string): Promise<RawGitCommit[]>;
declare function parseCommits(commits: RawGitCommit[], config: ChangelogConfig): GitCommit[];
declare function parseGitCommit(commit: RawGitCommit, config: ChangelogConfig): GitCommit | null;

interface GithubOptions {
    repo: string;
    token: string;
}
interface GithubRelease {
    id?: string;
    tag_name: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
}
declare function listGithubReleases(config: ResolvedChangelogConfig): Promise<GithubRelease[]>;
declare function getGithubReleaseByTag(config: ResolvedChangelogConfig, tag: string): Promise<GithubRelease>;
declare function getGithubChangelog(config: ResolvedChangelogConfig): Promise<any>;
declare function createGithubRelease(config: ResolvedChangelogConfig, body: GithubRelease): Promise<any>;
declare function updateGithubRelease(config: ResolvedChangelogConfig, id: string, body: GithubRelease): Promise<any>;
declare function syncGithubRelease(config: ResolvedChangelogConfig, release: {
    version: string;
    body: string;
}): Promise<{
    status: string;
    url: string;
    id?: undefined;
    error?: undefined;
} | {
    status: string;
    id: any;
    url?: undefined;
    error?: undefined;
} | {
    status: string;
    error: any;
    url: string;
    id?: undefined;
}>;
declare function githubNewReleaseURL(config: ResolvedChangelogConfig, release: {
    version: string;
    body: string;
}): string;
declare function resolveGithubToken(config: ResolvedChangelogConfig): Promise<any>;

declare function generateMarkDown(commits: GitCommit[], config: ResolvedChangelogConfig): Promise<string>;
declare function parseChangelogMarkdown(contents: string): {
    releases: {
        version?: string;
        body: string;
    }[];
};

export { BumpVersionOptions, ChangelogConfig, GitCommit, GitCommitAuthor, GithubOptions, GithubRelease, RawGitCommit, Reference, RepoConfig, RepoProvider, ResolvedChangelogConfig, SemverBumpType, bumpVersion, createGithubRelease, determineSemverChange, formatCompareChanges, formatReference, generateMarkDown, getCurrentGitBranch, getCurrentGitRef, getCurrentGitStatus, getCurrentGitTag, getGitDiff, getGitRemoteURL, getGithubChangelog, getGithubReleaseByTag, getLastGitTag, getRepoConfig, githubNewReleaseURL, listGithubReleases, loadChangelogConfig, parseChangelogMarkdown, parseCommits, parseGitCommit, resolveChangelogConfig, resolveGithubToken, resolveRepoConfig, syncGithubRelease, updateGithubRelease };
