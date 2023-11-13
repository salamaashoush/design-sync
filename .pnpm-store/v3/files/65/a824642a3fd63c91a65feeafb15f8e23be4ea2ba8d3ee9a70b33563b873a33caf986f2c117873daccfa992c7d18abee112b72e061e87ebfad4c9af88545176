import { isServer } from 'solid-js/web';
import { makeEventListener } from '@solid-primitives/event-listener';
import { noop, createHydratableSignal, entries } from '@solid-primitives/utils';
import { createHydratableStaticStore } from '@solid-primitives/static-store';
import { createHydratableSingletonRoot } from '@solid-primitives/rootless';

// src/index.ts
function makeMediaQueryListener(query, callback) {
  if (isServer) {
    return noop;
  }
  const mql = typeof query === "string" ? window.matchMedia(query) : query;
  return makeEventListener(mql, "change", callback);
}
function createMediaQuery(query, serverFallback = false) {
  if (isServer) {
    return () => serverFallback;
  }
  const mql = window.matchMedia(query);
  const [state, setState] = createHydratableSignal(serverFallback, () => mql.matches);
  const update = () => setState(mql.matches);
  makeEventListener(mql, "change", update);
  return state;
}
function createPrefersDark(serverFallback) {
  return createMediaQuery("(prefers-color-scheme: dark)", serverFallback);
}
var usePrefersDark = /* @__PURE__ */ createHydratableSingletonRoot(
  createPrefersDark.bind(void 0, false)
);
var getEmptyMatchesFromBreakpoints = (breakpoints) => entries(breakpoints).reduce(
  (matches, [key]) => {
    matches[key] = false;
    return matches;
  },
  {}
);
function createBreakpoints(breakpoints, options = {}) {
  const fallback = Object.defineProperty(
    options.fallbackState ?? getEmptyMatchesFromBreakpoints(breakpoints),
    "key",
    { enumerable: false, get: () => Object.keys(breakpoints).pop() }
  );
  if (isServer || !window.matchMedia)
    return fallback;
  const { mediaFeature = "min-width", watchChange = true } = options;
  const [matches, setMatches] = createHydratableStaticStore(fallback, () => {
    const matches2 = {};
    entries(breakpoints).forEach(([token, width]) => {
      const mql = window.matchMedia(`(${mediaFeature}: ${width})`);
      matches2[token] = mql.matches;
      if (watchChange)
        makeEventListener(
          mql,
          "change",
          (e) => setMatches(token, e.matches)
        );
    });
    return matches2;
  });
  return Object.defineProperty(matches, "key", {
    enumerable: false,
    get: () => Object.keys(matches).findLast((token) => matches[token])
  });
}
function sortBreakpoints(breakpoints) {
  const sorted = entries(breakpoints);
  sorted.sort((x, y) => parseInt(x[1], 10) - parseInt(y[1], 10));
  return sorted.reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
}

export { createBreakpoints, createMediaQuery, createPrefersDark, makeMediaQueryListener, sortBreakpoints, usePrefersDark };
