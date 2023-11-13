'use strict';

var solidJs = require('solid-js');
var utils = require('@solid-primitives/utils');

// src/propTraps.ts
function trueFn() {
  return true;
}
exports.propTraps = {
  get(_, property, receiver) {
    if (property === solidJs.$PROXY)
      return receiver;
    return _.get(property);
  },
  has(_, property) {
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function filterProps(props, predicate) {
  return new Proxy(
    {
      get(property) {
        return property in props && predicate(property) ? props[property] : void 0;
      },
      has(property) {
        return property in props && predicate(property);
      },
      keys() {
        return Object.keys(props).filter(predicate);
      }
    },
    exports.propTraps
  );
}
function createPropsPredicate(props, predicate) {
  const cache = solidJs.createMemo(
    () => {
      return {};
    },
    void 0,
    { equals: false }
  );
  return (key) => {
    const cacheRef = cache();
    const cached = cacheRef[key];
    if (cached !== void 0)
      return cached;
    const v = predicate(key);
    cacheRef[key] = v;
    return v;
  };
}
var extractCSSregex = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;
function stringStyleToObject(style) {
  const object = {};
  let match;
  while (match = extractCSSregex.exec(style)) {
    object[match[1]] = match[2];
  }
  return object;
}
function combineStyle(a, b) {
  if (typeof a === "string") {
    if (typeof b === "string")
      return `${a};${b}`;
    a = stringStyleToObject(a);
  } else if (typeof b === "string") {
    b = stringStyleToObject(b);
  }
  return { ...a, ...b };
}
var reduce = (sources, key, calc) => {
  let v = void 0;
  for (const props of sources) {
    const propV = utils.access(props)[key];
    if (!v)
      v = propV;
    else if (propV)
      v = calc(v, propV);
  }
  return v;
};
function combineProps(...args) {
  const restArgs = Array.isArray(args[0]);
  const sources = restArgs ? args[0] : args;
  if (sources.length === 1)
    return sources[0];
  const chainFn = restArgs && args[1]?.reverseEventHandlers ? utils.reverseChain : utils.chain;
  const listeners = {};
  for (const props of sources) {
    const propsObj = utils.access(props);
    for (const key in propsObj) {
      if (key[0] === "o" && key[1] === "n" && key[2]) {
        const v = propsObj[key];
        const name = key.toLowerCase();
        const callback = typeof v === "function" ? v : (
          // jsx event handlers can be tuples of [callback, arg]
          Array.isArray(v) ? v.length === 1 ? v[0] : v[0].bind(void 0, v[1]) : void 0
        );
        if (callback)
          listeners[name] ? listeners[name].push(callback) : listeners[name] = [callback];
        else
          delete listeners[name];
      }
    }
  }
  const merge = solidJs.mergeProps(...sources);
  return new Proxy(
    {
      get(key) {
        if (typeof key !== "string")
          return Reflect.get(merge, key);
        if (key === "style")
          return reduce(sources, "style", combineStyle);
        if (key === "ref") {
          const callbacks = [];
          for (const props of sources) {
            const cb = utils.access(props)[key];
            if (typeof cb === "function")
              callbacks.push(cb);
          }
          return chainFn(callbacks);
        }
        if (key[0] === "o" && key[1] === "n" && key[2]) {
          const callbacks = listeners[key.toLowerCase()];
          return callbacks ? chainFn(callbacks) : Reflect.get(merge, key);
        }
        if (key === "class" || key === "className")
          return reduce(sources, key, (a, b) => `${a} ${b}`);
        if (key === "classList")
          return reduce(sources, key, (a, b) => ({ ...a, ...b }));
        return Reflect.get(merge, key);
      },
      has(key) {
        return Reflect.has(merge, key);
      },
      keys() {
        return Object.keys(merge);
      }
    },
    exports.propTraps
  );
}

exports.combineProps = combineProps;
exports.combineStyle = combineStyle;
exports.createPropsPredicate = createPropsPredicate;
exports.filterProps = filterProps;
exports.stringStyleToObject = stringStyleToObject;
