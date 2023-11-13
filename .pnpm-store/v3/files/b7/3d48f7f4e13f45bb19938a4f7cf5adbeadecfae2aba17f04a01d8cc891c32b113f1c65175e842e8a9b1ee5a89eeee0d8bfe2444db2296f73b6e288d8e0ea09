import { chain, arrayEquals } from '@solid-primitives/utils';
import { createMemo, children, createComputed, untrack, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

// src/index.ts
function mergeRefs(...refs) {
  return chain(refs);
}
var defaultElementPredicate = isServer ? (item) => item != null && typeof item === "object" && "t" in item : (item) => item instanceof Element;
function getResolvedElements(value, predicate) {
  if (predicate(value))
    return value;
  if (typeof value === "function" && !value.length)
    return getResolvedElements(value(), predicate);
  if (Array.isArray(value)) {
    const results = [];
    for (const item of value) {
      const result = getResolvedElements(item, predicate);
      if (result)
        Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results.length ? results : null;
  }
  return null;
}
function resolveElements(fn, predicate = defaultElementPredicate, serverPredicate = defaultElementPredicate) {
  const children2 = createMemo(fn);
  const memo = createMemo(
    () => getResolvedElements(children2(), isServer ? serverPredicate : predicate)
  );
  memo.toArray = () => {
    const value = memo();
    return Array.isArray(value) ? value : value ? [value] : [];
  };
  return memo;
}
function getFirstChild(value, predicate) {
  if (predicate(value))
    return value;
  if (typeof value === "function" && !value.length)
    return getFirstChild(value(), predicate);
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = getFirstChild(item, predicate);
      if (result)
        return result;
    }
  }
  return null;
}
function resolveFirst(fn, predicate = defaultElementPredicate, serverPredicate = defaultElementPredicate) {
  const children2 = createMemo(fn);
  return createMemo(() => getFirstChild(children2(), isServer ? serverPredicate : predicate));
}
function Refs(props) {
  if (isServer) {
    return props.children;
  }
  const cb = props.ref, resolved = children(() => props.children);
  let prev = [];
  createComputed(() => {
    const els = resolved.toArray().filter(defaultElementPredicate);
    if (!arrayEquals(prev, els))
      untrack(() => cb(els));
    prev = els;
  }, []);
  onCleanup(() => prev.length && cb([]));
  return resolved;
}
function Ref(props) {
  if (isServer) {
    return props.children;
  }
  const cb = props.ref, resolved = children(() => props.children);
  let prev;
  createComputed(() => {
    const el = resolved.toArray().find(defaultElementPredicate);
    if (el !== prev)
      untrack(() => cb(el));
    prev = el;
  });
  onCleanup(() => prev && cb(void 0));
  return resolved;
}

export { Ref, Refs, defaultElementPredicate, getFirstChild, getResolvedElements, mergeRefs, resolveElements, resolveFirst };
