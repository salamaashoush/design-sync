'use strict';

var web = require('solid-js/web');
var eventListener = require('@solid-primitives/event-listener');
var utils = require('@solid-primitives/utils');
var staticStore = require('@solid-primitives/static-store');
var rootless = require('@solid-primitives/rootless');

// src/index.ts
function makeMediaQueryListener(query, callback) {
  if (web.isServer) {
    return utils.noop;
  }
  const mql = typeof query === "string" ? window.matchMedia(query) : query;
  return eventListener.makeEventListener(mql, "change", callback);
}
function createMediaQuery(query, serverFallback = false) {
  if (web.isServer) {
    return () => serverFallback;
  }
  const mql = window.matchMedia(query);
  const [state, setState] = utils.createHydratableSignal(serverFallback, () => mql.matches);
  const update = () => setState(mql.matches);
  eventListener.makeEventListener(mql, "change", update);
  return state;
}
function createPrefersDark(serverFallback) {
  return createMediaQuery("(prefers-color-scheme: dark)", serverFallback);
}
exports.usePrefersDark = /* @__PURE__ */ rootless.createHydratableSingletonRoot(
  createPrefersDark.bind(void 0, false)
);
var getEmptyMatchesFromBreakpoints = (breakpoints) => utils.entries(breakpoints).reduce(
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
  if (web.isServer || !window.matchMedia)
    return fallback;
  const { mediaFeature = "min-width", watchChange = true } = options;
  const [matches, setMatches] = staticStore.createHydratableStaticStore(fallback, () => {
    const matches2 = {};
    utils.entries(breakpoints).forEach(([token, width]) => {
      const mql = window.matchMedia(`(${mediaFeature}: ${width})`);
      matches2[token] = mql.matches;
      if (watchChange)
        eventListener.makeEventListener(
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
  const sorted = utils.entries(breakpoints);
  sorted.sort((x, y) => parseInt(x[1], 10) - parseInt(y[1], 10));
  return sorted.reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
}

exports.createBreakpoints = createBreakpoints;
exports.createMediaQuery = createMediaQuery;
exports.createPrefersDark = createPrefersDark;
exports.makeMediaQueryListener = makeMediaQueryListener;
exports.sortBreakpoints = sortBreakpoints;
