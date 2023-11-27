import { cssPlugin } from '@design-sync/css-plugin';
import { jsonPlugin } from '@design-sync/json-plugin';
import { vanillaExtractPlugin } from '@design-sync/vanilla-extract-plugin';

import { defineConfig, responsiveExtension } from '.';
console.log('dedupe-tokens config');

const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
};
const breakpointKeys = Object.keys(breakpoints);
export default defineConfig({
  uri: 'github:salamaashoush/kda-design-system/tokens#dedupe-tokens',
  out: 'generated',
  defaultMode: 'light',
  requiredModes: ['light', 'dark'],
  prettify: true,
  plugins: [cssPlugin(), vanillaExtractPlugin(), jsonPlugin()],
  schemaExtensions: [
    responsiveExtension({
      breakpoints,
      filter: ({ path, type }) => type === 'typography' && breakpointKeys.some((key) => path.endsWith(key)),
      base: 'xs',
      type: 'up',
    }),
  ],
});
