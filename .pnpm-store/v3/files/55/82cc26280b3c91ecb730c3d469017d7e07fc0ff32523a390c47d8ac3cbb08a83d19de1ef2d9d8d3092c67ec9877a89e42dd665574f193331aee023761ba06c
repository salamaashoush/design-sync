import { existsSync, promises } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import v8ToIstanbul from 'v8-to-istanbul';
import { mergeProcessCovs } from '@bcoe/v8-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import libCoverage from 'istanbul-lib-coverage';
import libSourceMaps from 'istanbul-lib-source-maps';
import MagicString from 'magic-string';
import remapping from '@ampproject/remapping';
import c from 'picocolors';
import { provider } from 'std-env';
import { builtinModules } from 'module';
import { coverageConfigDefaults, defaultExclude, defaultInclude } from 'vitest/config';
import { BaseCoverageProvider } from 'vitest/coverage';
import _TestExclude from 'test-exclude';

function normalizeWindowsPath(input = "") {
  if (!input || !input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}

const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const normalize = function(path) {
  if (path.length === 0) {
    return ".";
  }
  path = normalizeWindowsPath(path);
  const isUNCPath = path.match(_UNC_REGEX);
  const isPathAbsolute = isAbsolute(path);
  const trailingSeparator = path[path.length - 1] === "/";
  path = normalizeString(path, !isPathAbsolute);
  if (path.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path += "/";
  }
  if (_DRIVE_LETTER_RE.test(path)) {
    path += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path}`;
    }
    return `//${path}`;
  }
  return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};
function cwd() {
  if (typeof process !== "undefined") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};

const isWindows = process.platform === "win32";
const drive = isWindows ? process.cwd()[0] : null;
drive ? drive === drive.toUpperCase() ? drive.toLowerCase() : drive.toUpperCase() : null;
const queryRE = /\?.*$/s;
const hashRE = /#.*$/s;
function cleanUrl(url) {
  return url.replace(hashRE, "").replace(queryRE, "");
}
/* @__PURE__ */ new Set([
  ...builtinModules,
  "assert/strict",
  "diagnostics_channel",
  "dns/promises",
  "fs/promises",
  "path/posix",
  "path/win32",
  "readline/promises",
  "stream/consumers",
  "stream/promises",
  "stream/web",
  "timers/promises",
  "util/types",
  "wasi"
]);

const WRAPPER_LENGTH = 185;
const VITE_EXPORTS_LINE_PATTERN = /Object\.defineProperty\(__vite_ssr_exports__.*\n/g;
class V8CoverageProvider extends BaseCoverageProvider {
  name = "v8";
  ctx;
  options;
  testExclude;
  coverages = [];
  initialize(ctx) {
    const config = ctx.config.coverage;
    this.ctx = ctx;
    this.options = {
      ...coverageConfigDefaults,
      // User's options
      ...config,
      // Resolved fields
      provider: "v8",
      reporter: this.resolveReporters(config.reporter || coverageConfigDefaults.reporter),
      reportsDirectory: resolve(ctx.config.root, config.reportsDirectory || coverageConfigDefaults.reportsDirectory),
      lines: config["100"] ? 100 : config.lines,
      functions: config["100"] ? 100 : config.functions,
      branches: config["100"] ? 100 : config.branches,
      statements: config["100"] ? 100 : config.statements
    };
    this.testExclude = new _TestExclude({
      cwd: ctx.config.root,
      include: typeof this.options.include === "undefined" ? void 0 : [...this.options.include],
      exclude: [...defaultExclude, ...defaultInclude, ...this.options.exclude],
      excludeNodeModules: true,
      extension: this.options.extension,
      relativePath: !this.options.allowExternal
    });
  }
  resolveOptions() {
    return this.options;
  }
  async clean(clean = true) {
    if (clean && existsSync(this.options.reportsDirectory))
      await promises.rm(this.options.reportsDirectory, { recursive: true, force: true, maxRetries: 10 });
    this.coverages = [];
  }
  onAfterSuiteRun({ coverage }) {
    this.coverages.push(coverage);
  }
  async reportCoverage({ allTestsRun } = {}) {
    if (provider === "stackblitz")
      this.ctx.logger.log(c.blue(" % ") + c.yellow("@vitest/coverage-v8 does not work on Stackblitz. Report will be empty."));
    const transformResults = normalizeTransformResults(this.ctx.projects.map((project) => project.vitenode.fetchCache));
    const merged = mergeProcessCovs(this.coverages);
    const scriptCoverages = merged.result.filter((result) => this.testExclude.shouldInstrument(fileURLToPath(result.url)));
    if (this.options.all && allTestsRun) {
      const coveredFiles = Array.from(scriptCoverages.map((r) => r.url));
      const untestedFiles = await this.getUntestedFiles(coveredFiles, transformResults);
      scriptCoverages.push(...untestedFiles);
    }
    const converted = await Promise.all(scriptCoverages.map(async ({ url, functions }) => {
      const sources = await this.getSources(url, transformResults, functions);
      const wrapperLength = sources.sourceMap ? WRAPPER_LENGTH : 0;
      const converter = v8ToIstanbul(url, wrapperLength, sources);
      await converter.load();
      converter.applyCoverage(functions);
      return converter.toIstanbul();
    }));
    const mergedCoverage = converted.reduce((coverage, previousCoverageMap) => {
      const map = libCoverage.createCoverageMap(coverage);
      map.merge(previousCoverageMap);
      return map;
    }, libCoverage.createCoverageMap({}));
    const sourceMapStore = libSourceMaps.createSourceMapStore();
    const coverageMap = await sourceMapStore.transformCoverage(mergedCoverage);
    const context = libReport.createContext({
      dir: this.options.reportsDirectory,
      coverageMap,
      sourceFinder: sourceMapStore.sourceFinder,
      watermarks: this.options.watermarks
    });
    if (hasTerminalReporter(this.options.reporter))
      this.ctx.logger.log(c.blue(" % ") + c.dim("Coverage report from ") + c.yellow(this.name));
    for (const reporter of this.options.reporter) {
      reports.create(reporter[0], {
        skipFull: this.options.skipFull,
        projectRoot: this.ctx.config.root,
        ...reporter[1]
      }).execute(context);
    }
    if (this.options.branches || this.options.functions || this.options.lines || this.options.statements) {
      this.checkThresholds({
        coverageMap,
        thresholds: {
          branches: this.options.branches,
          functions: this.options.functions,
          lines: this.options.lines,
          statements: this.options.statements
        },
        perFile: this.options.perFile
      });
    }
    if (this.options.thresholdAutoUpdate && allTestsRun) {
      this.updateThresholds({
        coverageMap,
        thresholds: {
          branches: this.options.branches,
          functions: this.options.functions,
          lines: this.options.lines,
          statements: this.options.statements
        },
        perFile: this.options.perFile,
        configurationFile: this.ctx.server.config.configFile
      });
    }
  }
  async getUntestedFiles(testedFiles, transformResults) {
    const includedFiles = await this.testExclude.glob(this.ctx.config.root);
    const uncoveredFiles = includedFiles.map((file) => pathToFileURL(resolve(this.ctx.config.root, file))).filter((file) => !testedFiles.includes(file.href));
    return await Promise.all(uncoveredFiles.map(async (uncoveredFile) => {
      const { source } = await this.getSources(uncoveredFile.href, transformResults);
      return {
        url: uncoveredFile.href,
        scriptId: "0",
        // Create a made up function to mark whole file as uncovered. Note that this does not exist in source maps.
        functions: [{
          ranges: [{
            startOffset: 0,
            endOffset: source.length,
            count: 0
          }],
          isBlockCoverage: true,
          // This is magical value that indicates an empty report: https://github.com/istanbuljs/v8-to-istanbul/blob/fca5e6a9e6ef38a9cdc3a178d5a6cf9ef82e6cab/lib/v8-to-istanbul.js#LL131C40-L131C40
          functionName: "(empty-report)"
        }]
      };
    }));
  }
  async getSources(url, transformResults, functions = []) {
    var _a;
    const filePath = normalize(fileURLToPath(url));
    const transformResult = transformResults.get(filePath);
    const map = transformResult == null ? void 0 : transformResult.map;
    const code = transformResult == null ? void 0 : transformResult.code;
    const sourcesContent = ((_a = map == null ? void 0 : map.sourcesContent) == null ? void 0 : _a[0]) || await promises.readFile(filePath, "utf-8").catch(() => {
      const length = findLongestFunctionLength(functions);
      return ".".repeat(length);
    });
    if (!map)
      return { source: code || sourcesContent };
    return {
      originalSource: sourcesContent,
      source: code || sourcesContent,
      sourceMap: {
        sourcemap: removeViteHelpersFromSourceMaps(code, {
          ...map,
          version: 3,
          sources: [url],
          sourcesContent: [sourcesContent]
        })
      }
    };
  }
}
function removeViteHelpersFromSourceMaps(source, map) {
  if (!source || !source.match(VITE_EXPORTS_LINE_PATTERN))
    return map;
  const sourceWithoutHelpers = new MagicString(source);
  sourceWithoutHelpers.replaceAll(VITE_EXPORTS_LINE_PATTERN, "\n");
  const mapWithoutHelpers = sourceWithoutHelpers.generateMap({
    hires: true
  });
  const combinedMap = remapping(
    [{ ...mapWithoutHelpers, version: 3 }, map],
    () => null
  );
  return combinedMap;
}
function findLongestFunctionLength(functions) {
  return functions.reduce((previous, current) => {
    const maxEndOffset = current.ranges.reduce((endOffset, range) => Math.max(endOffset, range.endOffset), 0);
    return Math.max(previous, maxEndOffset);
  }, 0);
}
function normalizeTransformResults(fetchCaches) {
  const normalized = /* @__PURE__ */ new Map();
  for (const fetchCache of fetchCaches) {
    for (const [key, value] of fetchCache.entries()) {
      const cleanEntry = cleanUrl(key);
      if (!normalized.has(cleanEntry))
        normalized.set(cleanEntry, value.result);
    }
  }
  return normalized;
}
function hasTerminalReporter(reporters) {
  return reporters.some(([reporter]) => reporter === "text" || reporter === "text-summary" || reporter === "text-lcov" || reporter === "teamcity");
}

export { V8CoverageProvider };
