import { resolve } from 'node:path';
import { constants } from '@create-figma-plugin/common';
import { build } from 'esbuild';
import { globby } from 'globby';
import indentString from 'indent-string';
import { importFresh } from '../import-fresh.js';
import { esbuildCssModulesPlugin } from './esbuild-css-modules-plugin.js';
import { esbuildPreactCompatPlugin } from './esbuild-preact-compat-plugin.js';
export async function buildBundlesAsync(options) {
    const { config, minify, outputDirectory } = options;
    await Promise.all([
        buildMainBundleAsync({
            config,
            minify,
            outputDirectory
        }),
        buildUiBundleAsync({
            config,
            minify,
            outputDirectory
        })
    ]);
}
async function overrideEsbuildConfigAsync(buildOptions, configGlobPattern) {
    const filePaths = await globby(configGlobPattern, { absolute: true });
    if (filePaths.length === 0) {
        return buildOptions;
    }
    const overrideEsbuildConfig = await importFresh(filePaths[0]);
    if ('default' in overrideEsbuildConfig) {
        return overrideEsbuildConfig.default(buildOptions);
    }
    return overrideEsbuildConfig(buildOptions);
}
async function buildMainBundleAsync(options) {
    const { config, minify, outputDirectory } = options;
    const js = createMainEntryFile(config);
    try {
        const esbuildConfig = {
            bundle: true,
            logLevel: 'silent',
            minify,
            outfile: resolve(outputDirectory, constants.build.pluginCodeFilePath),
            platform: 'neutral',
            plugins: [],
            stdin: {
                contents: js,
                resolveDir: process.cwd()
            },
            target: 'es2017'
        };
        await build(await overrideEsbuildConfigAsync(esbuildConfig, constants.build.mainConfigGlobPattern));
    }
    catch (error) {
        throw new Error(formatEsbuildErrorMessage(error.message));
    }
}
function createMainEntryFile(config) {
    const { relaunchButtons, ...command } = config;
    const entryFiles = [];
    extractEntryFile(command, 'main', entryFiles);
    if (entryFiles.length === 0) {
        throw new Error('Need a `main` entry point');
    }
    if (relaunchButtons !== null) {
        extractEntryFiles(relaunchButtons, 'main', entryFiles);
    }
    return `
    const modules = ${createRequireCode(entryFiles)};
    const commandId = (${entryFiles.length === 1} || typeof figma.command === 'undefined' || figma.command === '' || figma.command === 'generate') ? '${entryFiles[0].commandId}' : figma.command;
    modules[commandId]();
  `;
}
async function buildUiBundleAsync(options) {
    const { config, minify, outputDirectory } = options;
    const js = createUiEntryFile(config);
    if (js === null) {
        return;
    }
    try {
        const esbuildConfig = {
            bundle: true,
            jsxFactory: 'h',
            jsxFragment: 'Fragment',
            loader: {
                '.gif': 'dataurl',
                '.jpg': 'dataurl',
                '.png': 'dataurl',
                '.svg': 'dataurl'
            },
            logLevel: 'silent',
            minify,
            outfile: resolve(outputDirectory, constants.build.pluginUiFilePath),
            plugins: [esbuildPreactCompatPlugin(), esbuildCssModulesPlugin(minify)],
            stdin: {
                contents: js,
                resolveDir: process.cwd()
            },
            target: 'chrome58'
        };
        await build(await overrideEsbuildConfigAsync(esbuildConfig, constants.build.uiConfigGlobPattern));
    }
    catch (error) {
        throw new Error(formatEsbuildErrorMessage(error.message));
    }
}
function createUiEntryFile(config) {
    const { relaunchButtons, ...command } = config;
    const modules = [];
    extractEntryFile(command, 'ui', modules);
    if (relaunchButtons !== null) {
        extractEntryFiles(relaunchButtons, 'ui', modules);
    }
    if (modules.length === 0) {
        return null;
    }
    return `
    const rootNode = document.getElementById('create-figma-plugin');
    const modules = ${createRequireCode(modules)};
    const commandId = __FIGMA_COMMAND__ === '' ? '${modules[0].commandId}' : __FIGMA_COMMAND__;
    if (typeof modules[commandId] === 'undefined') {
      throw new Error(
        'No UI defined for command \`' + commandId + '\`'
      );
    }
    modules[commandId](rootNode, __SHOW_UI_DATA__);
  `;
}
function extractEntryFiles(items, key, result) {
    for (const item of items) {
        if ('separator' in item) {
            continue;
        }
        extractEntryFile(item, key, result);
    }
}
function extractEntryFile(command, key, result) {
    const commandId = command.commandId;
    if (commandId !== null) {
        const item = command[key];
        if (item !== null) {
            const { src, handler } = item;
            result.push({
                commandId,
                handler,
                src
            });
        }
    }
    if ('menu' in command && command.menu !== null) {
        extractEntryFiles(command.menu, key, result);
    }
}
function createRequireCode(entryFiles) {
    const code = [];
    for (const entryFile of entryFiles) {
        code.push(`'${entryFile.commandId}':require('./${entryFile.src}')['${entryFile.handler}']`);
    }
    return `{${code.join(',')}}`;
}
function formatEsbuildErrorMessage(string) {
    return `esbuild error\n${indentString(string, 4)}`;
}
//# sourceMappingURL=build-bundles-async.js.map