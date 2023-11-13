import { getOwner, createRoot, runWithOwner, onCleanup, sharedConfig, createSignal, batch } from 'solid-js';
import { isServer } from 'solid-js/web';
import { asArray, access, trueFn, noop, createMicrotask } from '@solid-primitives/utils';

// src/index.ts
function createSubRoot(fn, ...owners) {
  if (owners.length === 0)
    owners = [getOwner()];
  return createRoot((dispose) => {
    asArray(access(owners)).forEach(
      (owner) => owner && runWithOwner(owner, onCleanup.bind(void 0, dispose))
    );
    return fn(dispose);
  }, owners[0]);
}
var createBranch = createSubRoot;
var createCallback = (callback, owner = getOwner()) => owner ? (...args) => runWithOwner(owner, () => callback(...args)) : callback;
function createDisposable(fn, ...owners) {
  return createSubRoot((dispose) => {
    fn(dispose);
    return dispose;
  }, ...owners);
}
function createSingletonRoot(factory, detachedOwner = getOwner()) {
  let listeners = 0, value, disposeRoot;
  return () => {
    listeners++;
    onCleanup(() => {
      listeners--;
      queueMicrotask(() => {
        if (!listeners && disposeRoot) {
          disposeRoot();
          disposeRoot = value = void 0;
        }
      });
    });
    if (!disposeRoot) {
      createRoot((dispose) => value = factory(disposeRoot = dispose), detachedOwner);
    }
    return value;
  };
}
var createSharedRoot = createSingletonRoot;
function createHydratableSingletonRoot(factory) {
  const owner = getOwner();
  const singleton = createSingletonRoot(factory, owner);
  return () => isServer || sharedConfig.context ? createRoot(factory, owner) : singleton();
}
function createRootPool(factory, options = {}) {
  if (isServer) {
    const owner2 = getOwner();
    return (args) => createRoot((dispose) => factory(() => args, trueFn, dispose), owner2);
  }
  let length = 0;
  const { limit = 100 } = options, pool = new Array(limit), owner = getOwner(), mapRoot = factory.length > 1 ? (dispose, [args, set]) => {
    const [active, setA] = createSignal(true);
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
    setA: trueFn,
    active: trueFn,
    v: factory(args, trueFn, noop)
  }), limitPool = createMicrotask(() => {
    if (length > limit) {
      for (let i = limit; i < length; i++) {
        pool[i].dispose();
        pool[i] = void 0;
      }
      length = limit;
    }
  }), cleanupRoot = (root) => {
    if (root.dispose !== noop) {
      pool[length++] = root;
      root.setA(false);
      limitPool();
    }
  }, disposeRoot = (root) => {
    root.dispose();
    root.dispose = noop;
    if (root.active())
      root.setA(false);
    else {
      pool[pool.indexOf(root)] = pool[--length];
      pool[length] = void 0;
    }
  };
  onCleanup(() => {
    for (let i = 0; i < length; i++)
      pool[i].dispose();
    length = 0;
  });
  return (arg) => {
    let root;
    if (length) {
      root = pool[--length];
      pool[length] = void 0;
      batch(() => {
        root.set(() => arg);
        root.setA(true);
      });
    } else
      root = createRoot((dispose) => mapRoot(dispose, createSignal(arg)), owner);
    onCleanup(() => cleanupRoot(root));
    return root.v;
  };
}

export { createBranch, createCallback, createDisposable, createHydratableSingletonRoot, createRootPool, createSharedRoot, createSingletonRoot, createSubRoot };
