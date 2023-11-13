'use strict';

var solidJs = require('solid-js');
var web = require('solid-js/web');
var utils = require('@solid-primitives/utils');

// src/index.ts
function createSubRoot(fn, ...owners) {
  if (owners.length === 0)
    owners = [solidJs.getOwner()];
  return solidJs.createRoot((dispose) => {
    utils.asArray(utils.access(owners)).forEach(
      (owner) => owner && solidJs.runWithOwner(owner, solidJs.onCleanup.bind(void 0, dispose))
    );
    return fn(dispose);
  }, owners[0]);
}
exports.createBranch = createSubRoot;
exports.createCallback = (callback, owner = solidJs.getOwner()) => owner ? (...args) => solidJs.runWithOwner(owner, () => callback(...args)) : callback;
function createDisposable(fn, ...owners) {
  return createSubRoot((dispose) => {
    fn(dispose);
    return dispose;
  }, ...owners);
}
function createSingletonRoot(factory, detachedOwner = solidJs.getOwner()) {
  let listeners = 0, value, disposeRoot;
  return () => {
    listeners++;
    solidJs.onCleanup(() => {
      listeners--;
      queueMicrotask(() => {
        if (!listeners && disposeRoot) {
          disposeRoot();
          disposeRoot = value = void 0;
        }
      });
    });
    if (!disposeRoot) {
      solidJs.createRoot((dispose) => value = factory(disposeRoot = dispose), detachedOwner);
    }
    return value;
  };
}
exports.createSharedRoot = createSingletonRoot;
function createHydratableSingletonRoot(factory) {
  const owner = solidJs.getOwner();
  const singleton = createSingletonRoot(factory, owner);
  return () => web.isServer || solidJs.sharedConfig.context ? solidJs.createRoot(factory, owner) : singleton();
}
function createRootPool(factory, options = {}) {
  if (web.isServer) {
    const owner2 = solidJs.getOwner();
    return (args) => solidJs.createRoot((dispose) => factory(() => args, utils.trueFn, dispose), owner2);
  }
  let length = 0;
  const { limit = 100 } = options, pool = new Array(limit), owner = solidJs.getOwner(), mapRoot = factory.length > 1 ? (dispose, [args, set]) => {
    const [active, setA] = solidJs.createSignal(true);
    const root = {
      dispose,
      set,
      setA,
      active,
      v: factory(args, active, () => disposeRoot(root))
    };
    return root;
  } : (dispose, [args, set]) => ({
    dispose,
    set,
    setA: utils.trueFn,
    active: utils.trueFn,
    v: factory(args, utils.trueFn, utils.noop)
  }), limitPool = utils.createMicrotask(() => {
    if (length > limit) {
      for (let i = limit; i < length; i++) {
        pool[i].dispose();
        pool[i] = void 0;
      }
      length = limit;
    }
  }), cleanupRoot = (root) => {
    if (root.dispose !== utils.noop) {
      pool[length++] = root;
      root.setA(false);
      limitPool();
    }
  }, disposeRoot = (root) => {
    root.dispose();
    root.dispose = utils.noop;
    if (root.active())
      root.setA(false);
    else {
      pool[pool.indexOf(root)] = pool[--length];
      pool[length] = void 0;
    }
  };
  solidJs.onCleanup(() => {
    for (let i = 0; i < length; i++)
      pool[i].dispose();
    length = 0;
  });
  return (arg) => {
    let root;
    if (length) {
      root = pool[--length];
      pool[length] = void 0;
      solidJs.batch(() => {
        root.set(() => arg);
        root.setA(true);
      });
    } else
      root = solidJs.createRoot((dispose) => mapRoot(dispose, solidJs.createSignal(arg)), owner);
    solidJs.onCleanup(() => cleanupRoot(root));
    return root.v;
  };
}

exports.createDisposable = createDisposable;
exports.createHydratableSingletonRoot = createHydratableSingletonRoot;
exports.createRootPool = createRootPool;
exports.createSingletonRoot = createSingletonRoot;
exports.createSubRoot = createSubRoot;
