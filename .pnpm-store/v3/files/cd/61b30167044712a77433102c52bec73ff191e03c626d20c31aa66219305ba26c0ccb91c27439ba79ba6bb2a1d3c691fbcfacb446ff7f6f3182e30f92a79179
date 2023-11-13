import { tryOnCleanup, entries, createCallbackStack, asArray, access, keys } from '@solid-primitives/utils';
import { createEffect, createRenderEffect, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

// src/eventListener.ts
function makeEventListener(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return tryOnCleanup(target.removeEventListener.bind(target, type, handler, options));
}
function createEventListener(targets, type, handler, options) {
  if (isServer)
    return;
  const attachListeners = () => {
    asArray(access(targets)).forEach((el) => {
      if (el)
        asArray(access(type)).forEach((type2) => makeEventListener(el, type2, handler, options));
    });
  };
  if (typeof targets === "function")
    createEffect(attachListeners);
  else
    createRenderEffect(attachListeners);
}
function createEventSignal(target, type, options) {
  if (isServer) {
    return () => void 0;
  }
  const [lastEvent, setLastEvent] = createSignal();
  createEventListener(target, type, setLastEvent, options);
  return lastEvent;
}
var eventListener = (target, props) => {
  createEffect(() => {
    const [type, handler, options] = props();
    makeEventListener(target, type, handler, options);
  });
};
function createEventListenerMap(targets, handlersMap, options) {
  if (isServer) {
    return;
  }
  for (const [eventName, handler] of entries(handlersMap)) {
    if (handler)
      createEventListener(targets, eventName, handler, options);
  }
}
var attachPropListeners = (target, props) => {
  keys(props).forEach((attr) => {
    if (attr.startsWith("on") && typeof props[attr] === "function")
      makeEventListener(target, attr.substring(2).toLowerCase(), props[attr]);
  });
};
var WindowEventListener = (props) => {
  if (isServer)
    return null;
  attachPropListeners(window, props);
};
var DocumentEventListener = (props) => {
  if (isServer)
    return null;
  attachPropListeners(document, props);
};
function makeEventListenerStack(target, options) {
  if (isServer) {
    return [() => () => void 0, () => void 0];
  }
  const { push, execute } = createCallbackStack();
  return [
    (type, handler, overwriteOptions) => {
      const clear = makeEventListener(target, type, handler, overwriteOptions ?? options);
      push(clear);
      return clear;
    },
    onCleanup(execute)
  ];
}

// src/callbackWrappers.ts
var preventDefault = (callback) => (e) => {
  e.preventDefault();
  callback(e);
};
var stopPropagation = (callback) => (e) => {
  e.stopPropagation();
  callback(e);
};
var stopImmediatePropagation = (callback) => (e) => {
  e.stopImmediatePropagation();
  callback(e);
};

export { DocumentEventListener, WindowEventListener, createEventListener, createEventListenerMap, createEventSignal, eventListener, makeEventListener, makeEventListenerStack, preventDefault, stopImmediatePropagation, stopPropagation };
