import { compare, ofClass } from '../chunk/R5675YMU.js';

// src/immutable/copy.ts
var shallowArrayCopy = (array) => array.slice();
var shallowObjectCopy = (object) => Object.assign({}, object);
var shallowCopy = (source) => Array.isArray(source) ? shallowArrayCopy(source) : shallowObjectCopy(source);
var withArrayCopy = (array, mutator) => {
  const copy = shallowArrayCopy(array);
  mutator(copy);
  return copy;
};
var withObjectCopy = (object, mutator) => {
  const copy = shallowObjectCopy(object);
  mutator(copy);
  return copy;
};
var withCopy = (source, mutator) => Array.isArray(source) ? withArrayCopy(source, mutator) : withObjectCopy(source, mutator);

// src/immutable/number.ts
function add(...a) {
  let r = 0;
  for (const n of a) {
    r += n;
  }
  return r;
}
var substract = (a, ...b) => {
  for (const n of b) {
    a -= n;
  }
  return a;
};
var multiply = (a, ...b) => {
  for (const n of b) {
    a *= n;
  }
  return a;
};
var divide = (a, ...b) => {
  for (const n of b) {
    a /= n;
  }
  return a;
};
var power = (a, ...b) => {
  for (const n of b) {
    a = a ** n;
  }
  return a;
};
var clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// src/immutable/update.ts
var update = (...args) => withCopy(args[0], (obj) => {
  if (args.length > 3)
    obj[args[1]] = update(obj[args[1]], ...args.slice(2));
  else if (typeof args[2] === "function")
    obj[args[1]] = args[2](obj[args[1]]);
  else
    obj[args[1]] = args[2];
});

// src/immutable/object.ts
var omit = (object, ...keys) => withObjectCopy(object, (object2) => keys.forEach((key) => delete object2[key]));
var pick = (object, ...keys) => keys.reduce((n, k) => {
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
  const copy = shallowObjectCopy(object);
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

// src/immutable/array.ts
var push = (list, ...items) => withArrayCopy(list, (list2) => list2.push(...items));
var drop = (list, n = 1) => list.slice(n);
var dropRight = (list, n = 1) => list.slice(0, list.length - n);
var filterOut = (list, item) => filter(list, (i) => i !== item);
function filter(list, predicate) {
  const newList = list.filter(predicate);
  newList.removed = list.length - newList.length;
  return newList;
}
var sort = (list, compareFn) => list.slice().sort(compareFn);
var map = (list, mapFn) => list.map(mapFn);
var slice = (list, start, end) => list.slice(start, end);
var splice = (list, start, deleteCount = 0, ...items) => withArrayCopy(list, (list2) => list2.splice(start, deleteCount, ...items));
var fill = (list, value, start, end) => list.slice().fill(value, start, end);
function concat(...a) {
  const result = [];
  for (const i in a) {
    Array.isArray(a[i]) ? result.push(...a[i]) : result.push(a[i]);
  }
  return result;
}
var remove = (list, item, ...insertItems) => {
  const index = list.indexOf(item);
  return splice(list, index, 1, ...insertItems);
};
var removeItems = (list, ...items) => {
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
var flatten = (arr) => arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next), []);
var sortBy = (arr, ...paths) => flatten(paths).reduce(
  (source, path) => sort(
    source,
    (a, b) => typeof path === "function" ? compare(path(a), path(b)) : compare(get(a, path), get(b, path))
  ),
  arr
);
var filterInstance = (list, ...classes) => classes.length === 1 ? list.filter((item) => ofClass(item, classes[0])) : list.filter((item) => item && classes.some((c) => ofClass(item, c)));
var filterOutInstance = (list, ...classes) => classes.length === 1 ? list.filter((item) => item && !ofClass(item, classes[0])) : list.filter((item) => item && !classes.some((c) => ofClass(item, c)));

export { add, clamp, concat, divide, drop, dropRight, fill, filter, filterInstance, filterOut, filterOutInstance, flatten, get, map, merge, multiply, omit, pick, power, push, remove, removeItems, shallowArrayCopy, shallowCopy, shallowObjectCopy, slice, sort, sortBy, splice, split, substract, update, withArrayCopy, withCopy, withObjectCopy };
