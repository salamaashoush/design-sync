import { isObject, accessWith } from '@solid-primitives/utils';
import { untrack, batch, sharedConfig, onMount, getOwner, createMemo, getListener, runWithOwner, createSignal } from 'solid-js';
import { isServer } from 'solid-js/web';

// src/index.ts
function createStaticStore(init) {
  const copy = { ...init }, store = { ...init }, cache = {};
  const getValue = (key) => {
    let signal = cache[key];
    if (!signal) {
      if (!getListener())
        return copy[key];
      cache[key] = signal = createSignal(copy[key], { internal: true });
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
      copy[key] = accessWith(value, [copy[key]]);
  };
  return [
    store,
    (a, b) => {
      if (isObject(a)) {
        const entries = untrack(
          () => Object.entries(accessWith(a, store))
        );
        batch(() => {
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
  if (isServer)
    return createStaticStore(serverValue);
  if (sharedConfig.context) {
    const [state, setState] = createStaticStore(serverValue);
    onMount(() => setState(update()));
    return [state, setState];
  }
  return createStaticStore(update());
}
function createDerivedStaticStore(fn, value, options) {
  const o = getOwner(), fnMemo = createMemo(fn, value, options), store = { ...untrack(fnMemo) }, cache = {};
  for (const key in store)
    Object.defineProperty(store, key, {
      get() {
        let keyMemo = cache[key];
        if (!keyMemo) {
          if (!getListener())
            return fnMemo()[key];
          runWithOwner(o, () => cache[key] = keyMemo = createMemo(() => fnMemo()[key]));
        }
        return keyMemo();
      },
      enumerable: true
    });
  return store;
}

export { createDerivedStaticStore, createHydratableStaticStore, createStaticStore };
