'use strict';

require('solid-js');
require('solid-js/web');

// src/immutable/copy.ts
exports.shallowArrayCopy = (array) => array.slice();
exports.shallowObjectCopy = (object) => Object.assign({}, object);
exports.shallowCopy = (source) => Array.isArray(source) ? exports.shallowArrayCopy(source) : exports.shallowObjectCopy(source);
exports.withArrayCopy = (array, mutator) => {
  const copy = exports.shallowArrayCopy(array);
  mutator(copy);
  return copy;
};
exports.withObjectCopy = (object, mutator) => {
  const copy = exports.shallowObjectCopy(object);
  mutator(copy);
  return copy;
};
exports.withCopy = (source, mutator) => Array.isArray(source) ? exports.withArrayCopy(source, mutator) : exports.withObjectCopy(source, mutator);

// src/immutable/number.ts
function add(...a) {
  let r = 0;
  for (const n of a) {
    r += n;
  }
  return r;
}
exports.substract = (a, ...b) => {
  for (const n of b) {
    a -= n;
  }
  return a;
};
exports.multiply = (a, ...b) => {
  for (const n of b) {
    a *= n;
  }
  return a;
};
exports.divide = (a, ...b) => {
  for (const n of b) {
    a /= n;
  }
  return a;
};
exports.power = (a, ...b) => {
  for (const n of b) {
    a = a ** n;
  }
  return a;
};
exports.clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// src/immutable/update.ts
exports.update = (...args) => exports.withCopy(args[0], (obj) => {
  if (args.length > 3)
    obj[args[1]] = exports.update(obj[args[1]], ...args.slice(2));
  else if (typeof args[2] === "function")
    obj[args[1]] = args[2](obj[args[1]]);
  else
    obj[args[1]] = args[2];
});

// src/immutable/object.ts
exports.omit = (object, ...keys) => exports.withObjectCopy(object, (object2) => keys.forEach((key) => delete object2[key]));
exports.pick = (object, ...keys) => keys.reduce((n, k) => {
  if (k in object)
    n[k] = object[k];
  return n;
}, {});
function get(obj, ...keys) {
  let res = obj;
  for (const key of keys) {
    res = res[key];
  }
  return res;
}
function split(object, ...list) {
  const _list = typeof list[0] === "string" ? [list] : list;
  const copy = exports.shallowObjectCopy(object);
  const result = [];
  for (let i = 0; i < _list.length; i++) {
    const keys = _list[i];
    result.push({});
    for (const key of keys) {
      result[i][key] = copy[key];
      delete copy[key];
    }
  }
  return [...result, copy];
}
function merge(...objects) {
  const result = {};
  for (const obj of objects) {
    Object.assign(result, obj);
  }
  return result;
}
var ofClass = (v, c) => v instanceof c || v && v.constructor === c;
var compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;

// src/immutable/array.ts
exports.push = (list, ...items) => exports.withArrayCopy(list, (list2) => list2.push(...items));
exports.drop = (list, n = 1) => list.slice(n);
exports.dropRight = (list, n = 1) => list.slice(0, list.length - n);
exports.filterOut = (list, item) => filter(list, (i) => i !== item);
function filter(list, predicate) {
  const newList = list.filter(predicate);
  newList.removed = list.length - newList.length;
  return newList;
}
exports.sort = (list, compareFn) => list.slice().sort(compareFn);
exports.map = (list, mapFn) => list.map(mapFn);
exports.slice = (list, start, end) => list.slice(start, end);
exports.splice = (list, start, deleteCount = 0, ...items) => exports.withArrayCopy(list, (list2) => list2.splice(start, deleteCount, ...items));
exports.fill = (list, value, start, end) => list.slice().fill(value, start, end);
function concat(...a) {
  const result = [];
  for (const i in a) {
    Array.isArray(a[i]) ? result.push(...a[i]) : result.push(a[i]);
  }
  return result;
}
exports.remove = (list, item, ...insertItems) => {
  const index = list.indexOf(item);
  return exports.splice(list, index, 1, ...insertItems);
};
exports.removeItems = (list, ...items) => {
  const res = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const ii = items.indexOf(item);
    if (ii !== -1)
      items.splice(ii, 1);
    else
      res.push(item);
  }
  return res;
};
exports.flatten = (arr) => arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? exports.flatten(next) : next), []);
exports.sortBy = (arr, ...paths) => exports.flatten(paths).reduce(
  (source, path) => exports.sort(
    source,
    (a, b) => typeof path === "function" ? compare(path(a), path(b)) : compare(get(a, path), get(b, path))
  ),
  arr
);
exports.filterInstance = (list, ...classes) => classes.length === 1 ? list.filter((item) => ofClass(item, classes[0])) : list.filter((item) => item && classes.some((c) => ofClass(item, c)));
exports.filterOutInstance = (list, ...classes) => classes.length === 1 ? list.filter((item) => item && !ofClass(item, classes[0])) : list.filter((item) => item && !classes.some((c) => ofClass(item, c)));

exports.add = add;
exports.concat = concat;
exports.filter = filter;
exports.get = get;
exports.merge = merge;
exports.split = split;
