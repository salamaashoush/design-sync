// build-figma-plugin.ui.js
import { vanillaExtractPlugin } from './vanilla-extract-plugin.js';

export default function (buildOptions) {
  return {
    ...buildOptions,
    plugins: [
      ...buildOptions.plugins,
      vanillaExtractPlugin({
        useStyleLoader: true,
      }),
    ],
  };
}
