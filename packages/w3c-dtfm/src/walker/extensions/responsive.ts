import { isTokenAlias } from '../../guards';
import { DesignTokenValueByMode, TokensWalkerExtension } from '../types';

type ResponsiveModifier = 'up' | 'down' | 'between' | 'only';

const defaultBreakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
  xxl: '2560px',
};

function getSortedBreakpoints(breakpoints: Record<string, string>) {
  return Object.keys(breakpoints).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

function up(breakpoint: string, breakpoints: Record<string, string>) {
  const bp = breakpoints[breakpoint];
  return `@media (min-width: ${bp})`;
}

function down(breakpoint: string, breakpoints: Record<string, string>) {
  const bp = breakpoints[breakpoint];
  return `@media (max-width: ${bp})`;
}

function between(start: string, end: string, breakpoints: Record<string, string>) {
  const bpStart = breakpoints[start];
  const bpEnd = breakpoints[end];
  return `@media (min-width: ${bpStart}) and (max-width: ${bpEnd})`;
}

function only(breakpoint: string, breakpoints: Record<string, string>) {
  const bp = breakpoints[breakpoint];
  const keys = getSortedBreakpoints(breakpoints);
  const nextIndex = keys.indexOf(breakpoint) + 1;
  const nextBp = breakpoints[keys[nextIndex]];
  return `@media (min-width: ${bp}) and (max-width: ${nextBp})`;
}

export interface ResponsiveExtensionOptions {
  filter: TokensWalkerExtension['filter'];
  breakpoints?: Record<string, string>;
  pathToBreakpoint?: (path: string) => string;
  type?: ResponsiveModifier;
  base?: string;
}

function defaultPathToBreakpoint(path: string) {
  const key = path.split('.').pop() as string;
  return key.replaceAll('@', '').replaceAll('_', '').replaceAll('-', '');
}
export function responsiveExtension({
  filter,
  breakpoints = defaultBreakpoints,
  type = 'up',
  base = 'xs',
  pathToBreakpoint = defaultPathToBreakpoint,
}: ResponsiveExtensionOptions): TokensWalkerExtension {
  console.log('responsiveExtension');
  return {
    name: 'default-responsive-extension',
    filter,
    run(token, walker) {
      const parentPath = token.path.split('.').slice(0, -1).join('.');
      const breakpointTokens = walker.filter(({ path }) => path.startsWith(parentPath));
      const breaks = {} as Record<string, string>;
      // normalize breakpoints
      for (const [key, value] of Object.entries(breakpoints)) {
        breaks[pathToBreakpoint(key)] = isTokenAlias(value) ? (walker.derefTokenValue(value) as string) : value;
      }

      const payload = {} as Record<string, DesignTokenValueByMode>;
      for (const breakpoint of breakpointTokens) {
        const key = pathToBreakpoint(breakpoint.path);
        if (key === pathToBreakpoint(base)) {
          payload.base = breakpoint.valueByMode;
          continue;
        }
        switch (type) {
          case 'up':
            payload[up(key, breaks)] = breakpoint.valueByMode;
            break;
          case 'down':
            payload[down(key, breaks)] = breakpoint.valueByMode;
            break;
          case 'between':
            payload[between(base, key, breaks)] = breakpoint.valueByMode;
            break;
          case 'only':
            payload[only(key, breaks)] = breakpoint.valueByMode;
            break;
        }
      }
      return [
        {
          extension: 'default-responsive-extension',
          type: 'remove',
          path: breakpointTokens.map(({ path }) => path),
        },
        {
          extension: 'default-responsive-extension',
          type: 'add',
          path: parentPath,
          isResponsive: true,
          payload,
        },
      ];
    },
  };
}
