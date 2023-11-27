import { cssPlugin } from '@design-sync/css-plugin';
import { jsonPlugin } from '@design-sync/json-plugin';
import { vanillaExtractPlugin } from '@design-sync/vanilla-extract-plugin';

import { defineConfig, responsiveExtension } from '.';
console.log('dedupe-tokens config');

const breakpoints = {
  xs: '{kda.foundation.breakpoint.xs}',
  sm: '{kda.foundation.breakpoint.sm}',
  md: '{kda.foundation.breakpoint.md}',
  lg: '{kda.foundation.breakpoint.lg}',
  xl: '{kda.foundation.breakpoint.xl}',
  xxl: '{kda.foundation.breakpoint.xxl}',
};
const breakpointKeys = Object.keys(breakpoints);
export default defineConfig({
  uri: 'github:kadena-community/design-system/tokens#main',
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
