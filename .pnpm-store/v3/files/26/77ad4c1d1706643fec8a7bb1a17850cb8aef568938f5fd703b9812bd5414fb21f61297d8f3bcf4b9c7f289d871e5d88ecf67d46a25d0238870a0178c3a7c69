import { dirname, join } from 'path';
import { vanillaExtractTransformPlugin, virtualCssFileFilter, getSourceFromVirtualCssFile, cssFileFilter, compile, processVanillaFile } from '@vanilla-extract/integration';

const vanillaCssNamespace = 'vanilla-extract-css-ns';
function vanillaExtractPlugin({
  outputCss,
  externals = [],
  runtime = false,
  processCss,
  identifiers,
  esbuildOptions
} = {}) {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes and debug IDs to code
    return vanillaExtractTransformPlugin({
      identOption: identifiers
    });
  }
  return {
    name: 'vanilla-extract',
    setup(build) {
      build.onResolve({
        filter: virtualCssFileFilter
      }, args => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace
        };
      });
      build.onLoad({
        filter: /.*/,
        namespace: vanillaCssNamespace
      }, async ({
        path
      }) => {
        var _build$initialOptions;
        let {
          source,
          fileName
        } = await getSourceFromVirtualCssFile(path);
        if (typeof processCss === 'function') {
          source = await processCss(source);
        }
        const rootDir = (_build$initialOptions = build.initialOptions.absWorkingDir) !== null && _build$initialOptions !== void 0 ? _build$initialOptions : process.cwd();
        const resolveDir = dirname(join(rootDir, fileName));
        return {
          contents: source,
          loader: 'css',
          resolveDir
        };
      });
      build.onLoad({
        filter: cssFileFilter
      }, async ({
        path
      }) => {
        var _esbuildOptions;
        const combinedEsbuildOptions = (_esbuildOptions = {
          ...esbuildOptions
        }) !== null && _esbuildOptions !== void 0 ? _esbuildOptions : {};
        const identOption = identifiers !== null && identifiers !== void 0 ? identifiers : build.initialOptions.minify ? 'short' : 'debug';

        // To avoid a breaking change this combines the `external` option from
        // esbuildOptions with the pre-existing externals option.
        if (externals) {
          if (combinedEsbuildOptions.external) {
            combinedEsbuildOptions.external.push(...externals);
          } else {
            combinedEsbuildOptions.external = externals;
          }
        }
        const {
          source,
          watchFiles
        } = await compile({
          filePath: path,
          cwd: build.initialOptions.absWorkingDir,
          esbuildOptions: combinedEsbuildOptions,
          identOption
        });
        const contents = await processVanillaFile({
          source,
          filePath: path,
          outputCss,
          identOption
        });
        return {
          contents,
          loader: 'js',
          watchFiles
        };
      });
    }
  };
}

export { vanillaExtractPlugin };
