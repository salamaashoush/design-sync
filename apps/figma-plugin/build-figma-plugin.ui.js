// build-figma-plugin.ui.js
const { vanillaExtractPlugin } = require('./vanilla-extract-plugin');

module.exports = function (buildOptions) {
  return {
    ...buildOptions,
    plugins: [
      ...buildOptions.plugins,
      vanillaExtractPlugin({
        useStyleLoader: true,
      }),
    ],
  };
};
