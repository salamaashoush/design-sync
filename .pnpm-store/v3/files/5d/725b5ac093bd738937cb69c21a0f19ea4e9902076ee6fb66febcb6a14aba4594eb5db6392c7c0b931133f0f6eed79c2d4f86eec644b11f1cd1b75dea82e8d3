'use strict';

var utils = require('@solid-primitives/utils');
var solidJs = require('solid-js');
var web = require('solid-js/web');

// src/index.ts
function createStaticStore(init) {
  const copy = { ...init }, store = { ...init }, cache = {};
  const getValue = (key) => {
    let signal = cache[key];
    if (!signal) {
      if (!solidJs.getListener())
        return copy[key];
      cache[key] = signal = solidJs.createSignal(copy[key], { internal: true });
      delete copy[key];
    }
    return signal[0]();
  };
  for (const key in init) {
    Object.defineProperty(store, key, { get: () => getValue(key), enumerable: true });
  }
  const setValue = (key, value) => {
    const signal = cache[key];
    if (signal)
      return signal[1](value);
    if (key in copy)
      copy[key] = utils.accessWith(value, [copy[key]]);
  };
  return [
    store,
    (a, b) => {
      if (utils.isObject(a)) {
        const entries = solidJs.untrack(
          () => Object.entries(utils.accessWith(a, store))
        );
        solidJs.batch(() => {
          for (const [key, value] of entries)
            setValue(key, () => value);
        });
      } else
        setValue(a, b);
      return store;
    }
  ];
}
function createHydratableStaticStore(serverValue, update) {
  if (web.isServer)
    return createStaticStore(serverValue);
  if (solidJs.sharedConfig.context) {
    const [state, setState] = createStaticStore(serverValue);
    solidJs.onMount(() => setState(update()));
    return [state, setState];
  }
  return createStaticStore(update());
}
function createDerivedStaticStore(fn, value, options) {
  const o = solidJs.getOwner(), fnMemo = solidJs.createMemo(fn, value, options), store = { ...solidJs.untrack(fnMemo) }, cache = {};
  for (const key in store)
    Object.defineProperty(store, key, {
      get() {
        let keyMemo = cache[key];
        if (!keyMemo) {
          if (!solidJs.getListener())
            return fnMemo()[key];
          solidJs.runWithOwner(o, () => cache[key] = keyMemo = solidJs.createMemo(() => fnMemo()[key]));
        }
        return keyMemo();
      },
      enumerable: true
    });
  return store;
}

exports.createDerivedStaticStore = createDerivedStaticStore;
exports.createHydratableStaticStore = createHydratableStaticStore;
exports.createStaticStore = createStaticStore;
