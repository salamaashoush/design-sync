'use strict';

var utils = require('@solid-primitives/utils');
var solidJs = require('solid-js');
var web = require('solid-js/web');

// src/index.ts
function mergeRefs(...refs) {
  return utils.chain(refs);
}
exports.defaultElementPredicate = web.isServer ? (item) => item != null && typeof item === "object" && "t" in item : (item) => item instanceof Element;
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
function resolveElements(fn, predicate = exports.defaultElementPredicate, serverPredicate = exports.defaultElementPredicate) {
  const children2 = solidJs.createMemo(fn);
  const memo = solidJs.createMemo(
    () => getResolvedElements(children2(), web.isServer ? serverPredicate : predicate)
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
function resolveFirst(fn, predicate = exports.defaultElementPredicate, serverPredicate = exports.defaultElementPredicate) {
  const children2 = solidJs.createMemo(fn);
  return solidJs.createMemo(() => getFirstChild(children2(), web.isServer ? serverPredicate : predicate));
}
function Refs(props) {
  if (web.isServer) {
    return props.children;
  }
  const cb = props.ref, resolved = solidJs.children(() => props.children);
  let prev = [];
  solidJs.createComputed(() => {
    const els = resolved.toArray().filter(exports.defaultElementPredicate);
    if (!utils.arrayEquals(prev, els))
      solidJs.untrack(() => cb(els));
    prev = els;
  }, []);
  solidJs.onCleanup(() => prev.length && cb([]));
  return resolved;
}
function Ref(props) {
  if (web.isServer) {
    return props.children;
  }
  const cb = props.ref, resolved = solidJs.children(() => props.children);
  let prev;
  solidJs.createComputed(() => {
    const el = resolved.toArray().find(exports.defaultElementPredicate);
    if (el !== prev)
      solidJs.untrack(() => cb(el));
    prev = el;
  });
  solidJs.onCleanup(() => prev && cb(void 0));
  return resolved;
}

exports.Ref = Ref;
exports.Refs = Refs;
exports.getFirstChild = getFirstChild;
exports.getResolvedElements = getResolvedElements;
exports.mergeRefs = mergeRefs;
exports.resolveElements = resolveElements;
exports.resolveFirst = resolveFirst;
