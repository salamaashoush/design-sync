import { DEV, equalFn, untrack, getOwner, onCleanup, createSignal, sharedConfig, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
export { isServer } from 'solid-js/web';

// src/index.ts
var isClient = !isServer;
var isDev = isClient && !!DEV;
var isProd = !isDev;
var noop = () => void 0;
var trueFn = () => true;
var falseFn = () => false;
var defaultEquals = equalFn;
var EQUALS_FALSE_OPTIONS = { equals: false };
var INTERNAL_OPTIONS = { internal: true };
var ofClass = (v, c) => v instanceof c || v && v.constructor === c;
function isObject(value) {
  return value !== null && (typeof value === "object" || typeof value === "function");
}
var isNonNullable = (i) => i != null;
var filterNonNullable = (arr) => arr.filter(isNonNullable);
var compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
var arrayEquals = (a, b) => a === b || a.length === b.length && a.every((e, i) => e === b[i]);
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
var clamp = (n, min, max) => Math.min(Math.max(n, min), max);
var access = (v) => typeof v === "function" && !v.length ? v() : v;
var asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
var accessArray = (list) => list.map((v) => access(v));
var withAccess = (value, fn) => {
  const _value = access(value);
  typeof _value != null && fn(_value);
};
var asAccessor = (v) => typeof v === "function" ? v : () => v;
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
    const result = untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
var entries = Object.entries;
var keys = Object.keys;
var tryOnCleanup = isDev ? (fn) => getOwner() ? onCleanup(fn) : fn : onCleanup;
var createCallbackStack = () => {
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
  onCleanup(() => calls = 0);
  return (...a) => {
    args = a, calls++;
    queueMicrotask(() => --calls === 0 && fn(...args));
  };
}
function createHydratableSignal(serverValue, update, options) {
  if (isServer) {
    return createSignal(serverValue, options);
  }
  if (sharedConfig.context) {
    const [state, setState] = createSignal(serverValue, options);
    onMount(() => setState(() => update()));
    return [state, setState];
  }
  return createSignal(update(), options);
}
var createHydrateSignal = createHydratableSignal;
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

export { EQUALS_FALSE_OPTIONS, INTERNAL_OPTIONS, access, accessArray, accessWith, arrayEquals, asAccessor, asArray, chain, clamp, compare, createCallbackStack, createHydratableSignal, createHydrateSignal, createMicrotask, defaultEquals, defer, entries, falseFn, filterNonNullable, handleDiffArray, isClient, isDev, isNonNullable, isObject, isProd, keys, noop, ofClass, reverseChain, trueFn, tryOnCleanup, withAccess };
