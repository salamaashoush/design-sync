import { isTokenAlias } from '../../guards';
import { DesignTokenValueByMode, TokensWalkerSchemaExtension } from '../types';

type ResponsiveModifier = 'up' | 'down' | 'between' | 'only';

const defaultBreakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
  xxl: '2560px',
};

function normalizeBp(bp: string) {
  // if the bp is a number followed by any unit return it as is otherwise return use px as default
  return /^-?\d+(\.\d+)?[a-zA-Z%]+$/g.test(bp) ? bp : `${bp}px`;
}

function up(breakpoint: string, breakpoints: Record<string, string>) {
  const bp = breakpoints[breakpoint];
  bp.replace('px', '');
  return `@media (width >= ${bp})`;
}

function down(breakpoint: string, breakpoints: Record<string, string>) {
  const bp = breakpoints[breakpoint];
  return `@media (width <= ${bp})`;
}

function between(start: string, end: string, breakpoints: Record<string, string>) {
  const bpStart = breakpoints[start];
  const bpEnd = breakpoints[end];
  return `@media  (${bpStart} <= width <= ${bpEnd})`;
}

function only(breakpoint: string, breakpoints: Record<string, string>) {
  const bp = breakpoints[breakpoint];
  return `@media (width: ${bp})`;
}

export interface ResponsiveExtensionOptions {
  filter: TokensWalkerSchemaExtension['filter'];
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
}: ResponsiveExtensionOptions): TokensWalkerSchemaExtension {
  return {
    name: 'default-responsive-extension',
    filter,
    run(token, walker) {
      const parentPath = token.path.split('.').slice(0, -1).join('.');
      const breakpointTokens = walker.filter(({ path }) => path.startsWith(parentPath));
      const breaks = {} as Record<string, string>;
      // normalize breakpoints
      for (const [key, value] of Object.entries(breakpoints)) {
        breaks[pathToBreakpoint(key)] = normalizeBp(
          isTokenAlias(value) ? (walker.derefTokenValue(value) as string) : value,
        );
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
