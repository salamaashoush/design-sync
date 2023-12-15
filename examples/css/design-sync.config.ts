import { defineConfig, responsiveExtension } from '@design-sync/cli';
import { cssPlugin } from '@design-sync/css-plugin';
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
  // uri: 'github:salamaashoush/kda-design-system/tokens#dedupe-tokens',
  uri: 'github:kadena-community/design-system/tokens#main',
  out: 'src/tokens',
  defaultMode: 'light',
  requiredModes: ['light', 'dark'],
  prettify: false,
  plugins: [cssPlugin()],
  schemaExtensions: [
    responsiveExtension({
      breakpoints,
      filter: ([path, token]) => token.$type === 'typography' && breakpointKeys.some((key) => path.endsWith(key)),
      base: 'xs',
      type: 'up',
    }),
  ],
});
