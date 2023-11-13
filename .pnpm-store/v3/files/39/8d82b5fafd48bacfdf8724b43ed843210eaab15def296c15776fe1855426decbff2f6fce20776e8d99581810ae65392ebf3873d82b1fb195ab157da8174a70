'use strict';

var solidJs = require('solid-js');
var web = require('solid-js/web');

// src/index.ts
exports.isClient = !web.isServer;
exports.isDev = exports.isClient && !!solidJs.DEV;
exports.isProd = !exports.isDev;
exports.noop = () => void 0;
exports.trueFn = () => true;
exports.falseFn = () => false;
exports.defaultEquals = solidJs.equalFn;
exports.EQUALS_FALSE_OPTIONS = { equals: false };
exports.INTERNAL_OPTIONS = { internal: true };
exports.ofClass = (v, c) => v instanceof c || v && v.constructor === c;
function isObject(value) {
  return value !== null && (typeof value === "object" || typeof value === "function");
}
exports.isNonNullable = (i) => i != null;
exports.filterNonNullable = (arr) => arr.filter(exports.isNonNullable);
exports.compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
exports.arrayEquals = (a, b) => a === b || a.length === b.length && a.every((e, i) => e === b[i]);
function chain(callbacks) {
  return (...args) => {
    for (const callback of callbacks)
      callback && callback(...args);
  };
}
function reverseChain(callbacks) {
  return (...args) => {
    for (let i = callbacks.length - 1; i >= 0; i--) {
      const callback = callbacks[i];
      callback && callback(...args);
    }
  };
}
exports.clamp = (n, min, max) => Math.min(Math.max(n, min), max);
exports.access = (v) => typeof v === "function" && !v.length ? v() : v;
exports.asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
exports.accessArray = (list) => list.map((v) => exports.access(v));
exports.withAccess = (value, fn) => {
  const _value = exports.access(value);
  typeof _value != null && fn(_value);
};
exports.asAccessor = (v) => typeof v === "function" ? v : () => v;
function accessWith(valueOrFn, ...args) {
  return typeof valueOrFn === "function" ? valueOrFn(...args) : valueOrFn;
}
function defer(deps, fn, initialValue) {
  const isArray = Array.isArray(deps);
  let prevInput;
  let shouldDefer = true;
  return (prevValue) => {
    let input;
    if (isArray) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++)
        input[i] = deps[i]();
    } else
      input = deps();
    if (shouldDefer) {
      shouldDefer = false;
      prevInput = input;
      return initialValue;
    }
    const result = solidJs.untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
exports.entries = Object.entries;
exports.keys = Object.keys;
exports.tryOnCleanup = exports.isDev ? (fn) => solidJs.getOwner() ? solidJs.onCleanup(fn) : fn : solidJs.onCleanup;
exports.createCallbackStack = () => {
  let stack = [];
  const clear = () => stack = [];
  return {
    push: (...callbacks) => stack.push(...callbacks),
    execute(arg0, arg1, arg2, arg3) {
      stack.forEach((cb) => cb(arg0, arg1, arg2, arg3));
      clear();
    },
    clear
  };
};
function createMicrotask(fn) {
  let calls = 0;
  let args;
  solidJs.onCleanup(() => calls = 0);
  return (...a) => {
    args = a, calls++;
    queueMicrotask(() => --calls === 0 && fn(...args));
  };
}
function createHydratableSignal(serverValue, update, options) {
  if (web.isServer) {
    return solidJs.createSignal(serverValue, options);
  }
  if (solidJs.sharedConfig.context) {
    const [state, setState] = solidJs.createSignal(serverValue, options);
    solidJs.onMount(() => setState(() => update()));
    return [state, setState];
  }
  return solidJs.createSignal(update(), options);
}
exports.createHydrateSignal = createHydratableSignal;
function handleDiffArray(current, prev, handleAdded, handleRemoved) {
  const currLength = current.length;
  const prevLength = prev.length;
  let i = 0;
  if (!prevLength) {
    for (; i < currLength; i++)
      handleAdded(current[i]);
    return;
  }
  if (!currLength) {
    for (; i < prevLength; i++)
      handleRemoved(prev[i]);
    return;
  }
  for (; i < prevLength; i++) {
    if (prev[i] !== current[i])
      break;
  }
  let prevEl;
  let currEl;
  prev = prev.slice(i);
  current = current.slice(i);
  for (prevEl of prev) {
    if (!current.includes(prevEl))
      handleRemoved(prevEl);
  }
  for (currEl of current) {
    if (!prev.includes(currEl))
      handleAdded(currEl);
  }
}

Object.defineProperty(exports, 'isServer', {
  enumerable: true,
  get: function () { return web.isServer; }
});
exports.accessWith = accessWith;
exports.chain = chain;
exports.createHydratableSignal = createHydratableSignal;
exports.createMicrotask = createMicrotask;
exports.defer = defer;
exports.handleDiffArray = handleDiffArray;
exports.isObject = isObject;
exports.reverseChain = reverseChain;
