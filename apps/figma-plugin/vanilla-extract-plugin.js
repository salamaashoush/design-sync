const { dirname, join } = require('path');

const {
  compile,
  cssFileFilter,
  getSourceFromVirtualCssFile,
  processVanillaFile,
  vanillaExtractTransformPlugin,
  virtualCssFileFilter,
} = require('@vanilla-extract/integration');
const crypto = require('crypto');
const vanillaCssNamespace = 'vanilla-extract-css-ns';

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return hash;
}

/**
 * @typedef {Object} VanillaExtractPluginOptions
 * @property {boolean} [outputCss] - Whether to output CSS files alongside JS files
 * @property {string[]} [externals] - List of modules to exclude from the bundle
 * @property {boolean} [runtime] - Whether to use runtime CSS
 * @property {(css: string) => Promise<string>} [processCss] - Function to process CSS before it is written to disk
 * @property {import('@vanilla-extract/integration').IdentifierOption} [identifiers] - Option to pass to the babel plugin
 * @property {import('esbuild').BuildOptions} [esbuildOptions] - Options to pass to esbuild
 * @property {boolean} [useStyleLoader] - Whether to use style-loader to inject CSS into the DOM
 * @returns {import('esbuild').Plugin}
 *
 * @param {VanillaExtractPluginOptions} options
 *
 */
function vanillaExtractPlugin({
  outputCss,
  externals = [],
  runtime = false,
  processCss,
  identifiers,
  esbuildOptions,
  useStyleLoader,
} = {}) {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes and debug IDs to code
    return vanillaExtractTransformPlugin({ identOption: identifiers });
  }

  return {
    name: 'vanilla-extract',
    setup(build) {
      build.onResolve({ filter: virtualCssFileFilter }, (args) => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace,
        };
      });

      build.onLoad({ filter: /.*/, namespace: vanillaCssNamespace }, async ({ path }) => {
        let { source, fileName } = await getSourceFromVirtualCssFile(path);

        if (typeof processCss === 'function') {
          source = await processCss(source);
        }

        const rootDir = build.initialOptions.absWorkingDir ?? process.cwd();
        const filePath = join(rootDir, fileName);
        const resolveDir = dirname(filePath);

        // If using style-loader then we need to return a JS file that inserts the CSS into the DOM
        if (useStyleLoader) {
          const elementId = `vanilla-extract-${
            build.initialOptions.minify ? await hashString(fileName) : fileName.replace(/[^a-zA-Z0-9-_]/g, '-')
          }`;
          const contents = `
              if (document.getElementById('${elementId}') === null) {
                const element = document.createElement('style');
                element.id = '${elementId}';
                element.textContent = \`${source}\`;
                document.head.append(element);
              }
              export default {};
              `;
          return {
            contents,
            loader: 'js',
            resolveDir,
          };
        }
        return {
          contents: source,
          loader: 'css',
          resolveDir,
        };
      });

      build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
        const combinedEsbuildOptions = { ...esbuildOptions } ?? {};
        const identOption = identifiers ?? (build.initialOptions.minify ? 'short' : 'debug');

        // To avoid a breaking change this combines the `external` option from
        // esbuildOptions with the pre-existing externals option.
        if (externals) {
          if (combinedEsbuildOptions.external) {
            combinedEsbuildOptions.external.push(...externals);
          } else {
            combinedEsbuildOptions.external = externals;
          }
        }

        const { source, watchFiles } = await compile({
          filePath: path,
          cwd: build.initialOptions.absWorkingDir,
          esbuildOptions: combinedEsbuildOptions,
          identOption,
        });

        const contents = await processVanillaFile({
          source,
          filePath: path,
          outputCss,
          identOption,
        });

        return {
          contents,
          loader: 'js',
          watchFiles,
        };
      });
    },
  };
}

module.exports = { vanillaExtractPlugin };
