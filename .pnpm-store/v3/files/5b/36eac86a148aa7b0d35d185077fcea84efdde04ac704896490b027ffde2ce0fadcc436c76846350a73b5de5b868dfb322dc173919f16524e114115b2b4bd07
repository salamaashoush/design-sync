'use strict';

var solidJs = require('solid-js');
var web = require('solid-js/web');
var utils = require('@solid-primitives/utils');

// src/index.ts
var triggerOptions = !web.isServer && solidJs.DEV ? { equals: false, name: "trigger" } : { equals: false };
var triggerCacheOptions = !web.isServer && solidJs.DEV ? { equals: false, internal: true } : triggerOptions;
function createTrigger() {
  if (web.isServer) {
    return [utils.noop, utils.noop];
  }
  return solidJs.createSignal(void 0, triggerOptions);
}
exports.TriggerCache = class TriggerCache {
  #map;
  constructor(mapConstructor = Map) {
    this.#map = new mapConstructor();
  }
  dirty(key) {
    if (web.isServer)
      return;
    this.#map.get(key)?.$$();
  }
  track(key) {
    if (!solidJs.getListener())
      return;
    let trigger = this.#map.get(key);
    if (!trigger) {
      const [$, $$] = solidJs.createSignal(void 0, triggerCacheOptions);
      this.#map.set(key, trigger = { $, $$, n: 1 });
    } else
      trigger.n++;
    solidJs.onCleanup(() => {
      if (trigger.n-- === 1)
        queueMicrotask(() => trigger.n === 0 && this.#map.delete(key));
    });
    trigger.$();
  }
};
function createTriggerCache(mapConstructor = Map) {
  const map = new exports.TriggerCache(mapConstructor);
  return [map.track.bind(map), map.dirty.bind(map)];
}

exports.createTrigger = createTrigger;
exports.createTriggerCache = createTriggerCache;
