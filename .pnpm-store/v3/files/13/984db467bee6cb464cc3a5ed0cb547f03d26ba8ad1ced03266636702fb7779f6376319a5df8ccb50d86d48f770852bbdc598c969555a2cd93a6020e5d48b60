import { onCleanup, $TRACK, untrack, createRoot, createSignal, createMemo, mapArray, on } from 'solid-js';
import { isServer } from 'solid-js/web';

// src/index.ts
var FALLBACK = Symbol("fallback");
function dispose(list) {
  for (const o of list)
    o.dispose();
}
function keyArray(items, keyFn, mapFn, options = {}) {
  if (isServer) {
    const itemsRef = items();
    let s = [];
    if (itemsRef && itemsRef.length) {
      for (let i = 0, len = itemsRef.length; i < len; i++)
        s.push(
          mapFn(
            () => itemsRef[i],
            () => i
          )
        );
    } else if (options.fallback)
      s = [options.fallback()];
    return () => s;
  }
  const prev = /* @__PURE__ */ new Map();
  onCleanup(() => dispose(prev.values()));
  return () => {
    const list = items() || [];
    list[$TRACK];
    return untrack(() => {
      if (!list.length) {
        dispose(prev.values());
        prev.clear();
        if (!options.fallback)
          return [];
        const fb2 = createRoot((dispose2) => {
          prev.set(FALLBACK, { dispose: dispose2 });
          return options.fallback();
        });
        return [fb2];
      }
      const result = new Array(list.length);
      const fb = prev.get(FALLBACK);
      if (!prev.size || fb) {
        fb?.dispose();
        prev.delete(FALLBACK);
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          const key = keyFn(item, i);
          addNewItem(result, item, i, key);
        }
        return result;
      }
      const prevKeys = new Set(prev.keys());
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const key = keyFn(item, i);
        prevKeys.delete(key);
        const lookup = prev.get(key);
        if (lookup) {
          result[i] = lookup.mapped;
          lookup.setIndex?.(i);
          lookup.setItem(() => item);
        } else
          addNewItem(result, item, i, key);
      }
      for (const key of prevKeys) {
        prev.get(key)?.dispose();
        prev.delete(key);
      }
      return result;
    });
  };
  function addNewItem(list, item, i, key) {
    createRoot((dispose2) => {
      const [getItem, setItem] = createSignal(item);
      const save = { setItem, dispose: dispose2 };
      if (mapFn.length > 1) {
        const [index, setIndex] = createSignal(i);
        save.setIndex = setIndex;
        save.mapped = mapFn(getItem, index);
      } else
        save.mapped = mapFn(getItem);
      prev.set(key, save);
      list[i] = save.mapped;
    });
  }
}
function Key(props) {
  const { by } = props;
  return createMemo(
    keyArray(
      () => props.each,
      typeof by === "function" ? by : (v) => v[by],
      props.children,
      "fallback" in props ? { fallback: () => props.fallback } : void 0
    )
  );
}
function Entries(props) {
  const mapFn = props.children;
  return createMemo(
    mapArray(
      () => props.of && Object.keys(props.of),
      mapFn.length < 3 ? (key) => mapFn(
        key,
        () => props.of[key]
      ) : (key, i) => mapFn(key, () => props.of[key], i),
      "fallback" in props ? { fallback: () => props.fallback } : void 0
    )
  );
}
function Rerun(props) {
  const key = typeof props.on === "function" || Array.isArray(props.on) ? props.on : () => props.on;
  return createMemo(
    on(key, (a, b) => {
      const child = props.children;
      return typeof child === "function" && child.length > 0 ? child(a, b) : child;
    })
  );
}

export { Entries, Key, Rerun, keyArray };
