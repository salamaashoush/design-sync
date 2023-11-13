'use strict';

var utils = require('@solid-primitives/utils');
var solidJs = require('solid-js');
var web = require('solid-js/web');

// src/eventListener.ts
function makeEventListener(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return utils.tryOnCleanup(target.removeEventListener.bind(target, type, handler, options));
}
function createEventListener(targets, type, handler, options) {
  if (web.isServer)
    return;
  const attachListeners = () => {
    utils.asArray(utils.access(targets)).forEach((el) => {
      if (el)
        utils.asArray(utils.access(type)).forEach((type2) => makeEventListener(el, type2, handler, options));
    });
  };
  if (typeof targets === "function")
    solidJs.createEffect(attachListeners);
  else
    solidJs.createRenderEffect(attachListeners);
}
function createEventSignal(target, type, options) {
  if (web.isServer) {
    return () => void 0;
  }
  const [lastEvent, setLastEvent] = solidJs.createSignal();
  createEventListener(target, type, setLastEvent, options);
  return lastEvent;
}
exports.eventListener = (target, props) => {
  solidJs.createEffect(() => {
    const [type, handler, options] = props();
    makeEventListener(target, type, handler, options);
  });
};
function createEventListenerMap(targets, handlersMap, options) {
  if (web.isServer) {
    return;
  }
  for (const [eventName, handler] of utils.entries(handlersMap)) {
    if (handler)
      createEventListener(targets, eventName, handler, options);
  }
}
var attachPropListeners = (target, props) => {
  utils.keys(props).forEach((attr) => {
    if (attr.startsWith("on") && typeof props[attr] === "function")
      makeEventListener(target, attr.substring(2).toLowerCase(), props[attr]);
  });
};
exports.WindowEventListener = (props) => {
  if (web.isServer)
    return null;
  attachPropListeners(window, props);
};
exports.DocumentEventListener = (props) => {
  if (web.isServer)
    return null;
  attachPropListeners(document, props);
};
function makeEventListenerStack(target, options) {
  if (web.isServer) {
    return [() => () => void 0, () => void 0];
  }
  const { push, execute } = utils.createCallbackStack();
  return [
    (type, handler, overwriteOptions) => {
      const clear = makeEventListener(target, type, handler, overwriteOptions ?? options);
      push(clear);
      return clear;
    },
    solidJs.onCleanup(execute)
  ];
}

// src/callbackWrappers.ts
exports.preventDefault = (callback) => (e) => {
  e.preventDefault();
  callback(e);
};
exports.stopPropagation = (callback) => (e) => {
  e.stopPropagation();
  callback(e);
};
exports.stopImmediatePropagation = (callback) => (e) => {
  e.stopImmediatePropagation();
  callback(e);
};

exports.createEventListener = createEventListener;
exports.createEventListenerMap = createEventListenerMap;
exports.createEventSignal = createEventSignal;
exports.makeEventListener = makeEventListener;
exports.makeEventListenerStack = makeEventListenerStack;
