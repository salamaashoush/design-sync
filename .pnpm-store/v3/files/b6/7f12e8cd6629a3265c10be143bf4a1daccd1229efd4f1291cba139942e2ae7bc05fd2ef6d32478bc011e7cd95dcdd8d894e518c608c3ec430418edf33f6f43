'use strict';

var solidJs = require('solid-js');
var eventListener = require('@solid-primitives/event-listener');
var keyed = require('@solid-primitives/keyed');
var map = require('@solid-primitives/map');
var media = require('@solid-primitives/media');
var props = require('@solid-primitives/props');
var refs = require('@solid-primitives/refs');
var utils = require('@solid-primitives/utils');

// src/array.ts
function addItemToArray(array, item, index = -1) {
  if (!(index in array)) {
    return [...array, item];
  }
  return [...array.slice(0, index), item, ...array.slice(index)];
}
function removeItemFromArray(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}

// src/assertion.ts
function isNumber(value) {
  return typeof value === "number";
}
function isArray(value) {
  return Array.isArray(value);
}
function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}
function isFunction(value) {
  return typeof value === "function";
}

// src/create-generate-id.ts
function createGenerateId(baseId) {
  return (suffix) => `${baseId()}-${suffix}`;
}
function createGlobalListeners() {
  const globalListeners = /* @__PURE__ */ new Map();
  const addGlobalListener = (eventTarget, type, listener, options) => {
    const fn = options?.once ? (...args) => {
      globalListeners.delete(listener);
      listener(...args);
    } : listener;
    globalListeners.set(listener, { type, eventTarget, fn, options });
    eventTarget.addEventListener(type, listener, options);
  };
  const removeGlobalListener = (eventTarget, type, listener, options) => {
    const fn = globalListeners.get(listener)?.fn || listener;
    eventTarget.removeEventListener(type, fn, options);
    globalListeners.delete(listener);
  };
  const removeAllGlobalListeners = () => {
    globalListeners.forEach((value, key) => {
      removeGlobalListener(value.eventTarget, value.type, key, value.options);
    });
  };
  solidJs.onCleanup(() => {
    removeAllGlobalListeners();
  });
  return { addGlobalListener, removeGlobalListener, removeAllGlobalListeners };
}

// src/dom.ts
function contains(parent, child) {
  if (!parent) {
    return false;
  }
  return parent === child || parent.contains(child);
}
function getActiveElement(node, activeDescendant = false) {
  const { activeElement } = getDocument(node);
  if (!activeElement?.nodeName) {
    return null;
  }
  if (isFrame(activeElement) && activeElement.contentDocument) {
    return getActiveElement(activeElement.contentDocument.body, activeDescendant);
  }
  if (activeDescendant) {
    const id = activeElement.getAttribute("aria-activedescendant");
    if (id) {
      const element = getDocument(activeElement).getElementById(id);
      if (element) {
        return element;
      }
    }
  }
  return activeElement;
}
function getWindow(node) {
  return getDocument(node).defaultView || window;
}
function getDocument(node) {
  return node ? node.ownerDocument || node : document;
}
function isFrame(element) {
  return element.tagName === "IFRAME";
}

// src/enums.ts
var EventKey = /* @__PURE__ */ ((EventKey2) => {
  EventKey2["Escape"] = "Escape";
  EventKey2["Enter"] = "Enter";
  EventKey2["Tab"] = "Tab";
  EventKey2["Space"] = " ";
  EventKey2["ArrowDown"] = "ArrowDown";
  EventKey2["ArrowLeft"] = "ArrowLeft";
  EventKey2["ArrowRight"] = "ArrowRight";
  EventKey2["ArrowUp"] = "ArrowUp";
  EventKey2["End"] = "End";
  EventKey2["Home"] = "Home";
  EventKey2["PageDown"] = "PageDown";
  EventKey2["PageUp"] = "PageUp";
  return EventKey2;
})(EventKey || {});

// src/platform.ts
function testUserAgent(re) {
  if (typeof window === "undefined" || window.navigator == null) {
    return false;
  }
  return (
    // @ts-ignore
    window.navigator["userAgentData"]?.brands.some(
      (brand) => re.test(brand.brand)
    ) || re.test(window.navigator.userAgent)
  );
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? (
    // @ts-ignore
    re.test(window.navigator["userAgentData"]?.platform || window.navigator.platform)
  ) : false;
}
function isMac() {
  return testPlatform(/^Mac/i);
}
function isIPhone() {
  return testPlatform(/^iPhone/i);
}
function isIPad() {
  return testPlatform(/^iPad/i) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function isAppleDevice() {
  return isMac() || isIOS();
}
function isWebKit() {
  return testUserAgent(/AppleWebKit/i) && !isChrome();
}
function isChrome() {
  return testUserAgent(/Chrome/i);
}
function isAndroid() {
  return testUserAgent(/Android/i);
}

// src/events.ts
function callHandler(event, handler) {
  if (handler) {
    if (isFunction(handler)) {
      handler(event);
    } else {
      handler[0](handler[1], event);
    }
  }
  return event?.defaultPrevented;
}
function composeEventHandlers(handlers) {
  return (event) => {
    for (const handler of handlers) {
      callHandler(event, handler);
    }
  };
}
function isCtrlKey(e) {
  if (isMac()) {
    return e.metaKey && !e.ctrlKey;
  }
  return e.ctrlKey && !e.metaKey;
}

// src/focus-without-scrolling.ts
function focusWithoutScrolling(element) {
  if (!element) {
    return;
  }
  if (supportsPreventScroll()) {
    element.focus({ preventScroll: true });
  } else {
    const scrollableElements = getScrollableElements(element);
    element.focus();
    restoreScrollPosition(scrollableElements);
  }
}
var supportsPreventScrollCached = null;
function supportsPreventScroll() {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;
    try {
      const focusElem = document.createElement("div");
      focusElem.focus({
        get preventScroll() {
          supportsPreventScrollCached = true;
          return true;
        }
      });
    } catch (e) {
    }
  }
  return supportsPreventScrollCached;
}
function getScrollableElements(element) {
  let parent = element.parentNode;
  const scrollableElements = [];
  const rootScrollingElement = document.scrollingElement || document.documentElement;
  while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) {
      scrollableElements.push({
        element: parent,
        scrollTop: parent.scrollTop,
        scrollLeft: parent.scrollLeft
      });
    }
    parent = parent.parentNode;
  }
  if (rootScrollingElement instanceof HTMLElement) {
    scrollableElements.push({
      element: rootScrollingElement,
      scrollTop: rootScrollingElement.scrollTop,
      scrollLeft: rootScrollingElement.scrollLeft
    });
  }
  return scrollableElements;
}
function restoreScrollPosition(scrollableElements) {
  for (const { element, scrollTop, scrollLeft } of scrollableElements) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
}

// src/tabbable.ts
var focusableElements = [
  "input:not([type='hidden']):not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "[tabindex]",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])"
];
var tabbableElements = [...focusableElements, '[tabindex]:not([tabindex="-1"]):not([disabled])'];
var FOCUSABLE_ELEMENT_SELECTOR = focusableElements.join(":not([hidden]),") + ",[tabindex]:not([disabled]):not([hidden])";
var TABBABLE_ELEMENT_SELECTOR = tabbableElements.join(
  ':not([hidden]):not([tabindex="-1"]),'
);
function getAllTabbableIn(container, includeContainer) {
  const elements = Array.from(container.querySelectorAll(FOCUSABLE_ELEMENT_SELECTOR));
  const tabbableElements2 = elements.filter(isTabbable);
  if (includeContainer && isTabbable(container)) {
    tabbableElements2.unshift(container);
  }
  tabbableElements2.forEach((element, i) => {
    if (isFrame(element) && element.contentDocument) {
      const frameBody = element.contentDocument.body;
      const allFrameTabbable = getAllTabbableIn(frameBody, false);
      tabbableElements2.splice(i, 1, ...allFrameTabbable);
    }
  });
  return tabbableElements2;
}
function isTabbable(element) {
  return isFocusable(element) && !hasNegativeTabIndex(element);
}
function isFocusable(element) {
  return element.matches(FOCUSABLE_ELEMENT_SELECTOR) && isElementVisible(element);
}
function hasNegativeTabIndex(element) {
  const tabIndex = parseInt(element.getAttribute("tabindex") || "0", 10);
  return tabIndex < 0;
}
function isElementVisible(element, childElement) {
  return element.nodeName !== "#comment" && isStyleVisible(element) && isAttributeVisible(element, childElement) && (!element.parentElement || isElementVisible(element.parentElement, element));
}
function isStyleVisible(element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    return false;
  }
  const { display, visibility } = element.style;
  let isVisible = display !== "none" && visibility !== "hidden" && visibility !== "collapse";
  if (isVisible) {
    if (!element.ownerDocument.defaultView) {
      return isVisible;
    }
    const { getComputedStyle } = element.ownerDocument.defaultView;
    const { display: computedDisplay, visibility: computedVisibility } = getComputedStyle(element);
    isVisible = computedDisplay !== "none" && computedVisibility !== "hidden" && computedVisibility !== "collapse";
  }
  return isVisible;
}
function isAttributeVisible(element, childElement) {
  return !element.hasAttribute("hidden") && (element.nodeName === "DETAILS" && childElement && childElement.nodeName !== "SUMMARY" ? element.hasAttribute("open") : true);
}
function hasFocusWithin(element) {
  const activeElement = getActiveElement(element);
  if (!activeElement) {
    return false;
  }
  if (!contains(element, activeElement)) {
    const activeDescendant = activeElement.getAttribute("aria-activedescendant");
    if (!activeDescendant) {
      return false;
    }
    if (!("id" in element)) {
      return false;
    }
    if (activeDescendant === element.id) {
      return true;
    }
    return !!element.querySelector(`#${CSS.escape(activeDescendant)}`);
  } else {
    return true;
  }
}

// src/focus-manager.ts
function createFocusManager(ref, defaultOptions = () => ({})) {
  const focusNext = (opts = {}) => {
    const root = ref();
    if (!root) {
      return;
    }
    const {
      from = defaultOptions().from || document.activeElement,
      tabbable = defaultOptions().tabbable,
      wrap = defaultOptions().wrap,
      accept = defaultOptions().accept
    } = opts;
    const walker = getFocusableTreeWalker(root, { tabbable, accept });
    if (from && root.contains(from)) {
      walker.currentNode = from;
    }
    let nextNode = walker.nextNode();
    if (!nextNode && wrap) {
      walker.currentNode = root;
      nextNode = walker.nextNode();
    }
    if (nextNode) {
      focusElement(nextNode, true);
    }
    return nextNode;
  };
  const focusPrevious = (opts = {}) => {
    const root = ref();
    if (!root) {
      return;
    }
    const {
      from = defaultOptions().from || document.activeElement,
      tabbable = defaultOptions().tabbable,
      wrap = defaultOptions().wrap,
      accept = defaultOptions().accept
    } = opts;
    const walker = getFocusableTreeWalker(root, { tabbable, accept });
    if (from && root.contains(from)) {
      walker.currentNode = from;
    } else {
      const next = last(walker);
      if (next) {
        focusElement(next, true);
      }
      return next;
    }
    let previousNode = walker.previousNode();
    if (!previousNode && wrap) {
      walker.currentNode = root;
      previousNode = last(walker);
    }
    if (previousNode) {
      focusElement(previousNode, true);
    }
    return previousNode;
  };
  const focusFirst = (opts = {}) => {
    const root = ref();
    if (!root) {
      return;
    }
    const { tabbable = defaultOptions().tabbable, accept = defaultOptions().accept } = opts;
    const walker = getFocusableTreeWalker(root, { tabbable, accept });
    const nextNode = walker.nextNode();
    if (nextNode) {
      focusElement(nextNode, true);
    }
    return nextNode;
  };
  const focusLast = (opts = {}) => {
    const root = ref();
    if (!root) {
      return;
    }
    const { tabbable = defaultOptions().tabbable, accept = defaultOptions().accept } = opts;
    const walker = getFocusableTreeWalker(root, { tabbable, accept });
    const next = last(walker);
    if (next) {
      focusElement(next, true);
    }
    return next;
  };
  return { focusNext, focusPrevious, focusFirst, focusLast };
}
function focusElement(element, scroll = false) {
  if (element != null && !scroll) {
    try {
      focusWithoutScrolling(element);
    } catch (err) {
    }
  } else if (element != null) {
    try {
      element.focus();
    } catch (err) {
    }
  }
}
function last(walker) {
  let next;
  let last2;
  do {
    last2 = walker.lastChild();
    if (last2) {
      next = last2;
    }
  } while (last2);
  return next;
}
function isElementInScope(element, scope) {
  return scope.some((node) => node.contains(element));
}
function getFocusableTreeWalker(root, opts, scope) {
  const selector = opts?.tabbable ? TABBABLE_ELEMENT_SELECTOR : FOCUSABLE_ELEMENT_SELECTOR;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (opts?.from?.contains(node)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (node.matches(selector) && isElementVisible(node) && (!scope || isElementInScope(node, scope)) && (!opts?.accept || opts.accept(node))) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    }
  });
  if (opts?.from) {
    walker.currentNode = opts.from;
  }
  return walker;
}

// src/get-scroll-parent.ts
function getScrollParent(node) {
  while (node && !isScrollable(node)) {
    node = node.parentElement;
  }
  return node || document.scrollingElement || document.documentElement;
}
function isScrollable(node) {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}

// src/is-virtual-event.ts
function isVirtualClick(event) {
  if (event.mozInputSource === 0 && event.isTrusted) {
    return true;
  }
  if (isAndroid() && event.pointerType) {
    return event.type === "click" && event.buttons === 1;
  }
  return event.detail === 0 && !event.pointerType;
}
function isVirtualPointerEvent(event) {
  return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "mouse";
}

// src/noop.ts
function noop() {
  return;
}

// src/number.ts
function clamp(value, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max);
}
function snapValueToStep(value, min, max, step) {
  const remainder = (value - (isNaN(min) ? 0 : min)) % step;
  let snappedValue = Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder;
  if (!isNaN(min)) {
    if (snappedValue < min) {
      snappedValue = min;
    } else if (!isNaN(max) && snappedValue > max) {
      snappedValue = min + Math.floor((max - min) / step) * step;
    }
  } else if (!isNaN(max) && snappedValue > max) {
    snappedValue = Math.floor(max / step) * step;
  }
  const string = step.toString();
  const index = string.indexOf(".");
  const precision = index >= 0 ? string.length - index : 0;
  if (precision > 0) {
    const pow = Math.pow(10, precision);
    snappedValue = Math.round(snappedValue * pow) / pow;
  }
  return snappedValue;
}

// src/polygon.ts
function getEventPoint(event) {
  return [event.clientX, event.clientY];
}
function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  const length = polygon.length;
  for (let l = length, i = 0, j = l - 1; i < l; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const [, vy] = polygon[j === 0 ? l - 1 : j - 1] || [0, 0];
    const where = (yi - yj) * (x - xi) - (xi - xj) * (y - yi);
    if (yj < yi) {
      if (y >= yj && y < yi) {
        if (where === 0)
          return true;
        if (where > 0) {
          if (y === yj) {
            if (y > vy) {
              inside = !inside;
            }
          } else {
            inside = !inside;
          }
        }
      }
    } else if (yi < yj) {
      if (y > yi && y <= yj) {
        if (where === 0)
          return true;
        if (where < 0) {
          if (y === yj) {
            if (y < vy) {
              inside = !inside;
            }
          } else {
            inside = !inside;
          }
        }
      }
    } else if (y == yi && (x >= xj && x <= xi || x >= xi && x <= xj)) {
      return true;
    }
  }
  return inside;
}
function getPolygon() {
  const id = "debug-polygon";
  const existingPolygon = document.getElementById(id);
  if (existingPolygon) {
    return existingPolygon;
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.fill = "green";
  svg.style.opacity = "0.2";
  svg.style.position = "fixed";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = "999999";
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("id", id);
  polygon.setAttribute("points", "0,0 0,0");
  svg.appendChild(polygon);
  document.body.appendChild(svg);
  return polygon;
}
function debugPolygon(polygon) {
  const polygonElement = getPolygon();
  const points = polygon.map((point) => point.join(",")).join(" ");
  polygonElement.setAttribute("points", points);
  return polygonElement.parentElement;
}
function mergeDefaultProps(defaultProps, props) {
  return solidJs.mergeProps(defaultProps, props);
}

// src/run-after-transition.ts
var transitionsByElement = /* @__PURE__ */ new Map();
var transitionCallbacks = /* @__PURE__ */ new Set();
function setupGlobalEvents() {
  if (typeof window === "undefined") {
    return;
  }
  const onTransitionStart = (e) => {
    if (!e.target) {
      return;
    }
    let transitions = transitionsByElement.get(e.target);
    if (!transitions) {
      transitions = /* @__PURE__ */ new Set();
      transitionsByElement.set(e.target, transitions);
      e.target.addEventListener("transitioncancel", onTransitionEnd);
    }
    transitions.add(e.propertyName);
  };
  const onTransitionEnd = (e) => {
    if (!e.target) {
      return;
    }
    const properties = transitionsByElement.get(e.target);
    if (!properties) {
      return;
    }
    properties.delete(e.propertyName);
    if (properties.size === 0) {
      e.target.removeEventListener("transitioncancel", onTransitionEnd);
      transitionsByElement.delete(e.target);
    }
    if (transitionsByElement.size === 0) {
      for (const cb of transitionCallbacks) {
        cb();
      }
      transitionCallbacks.clear();
    }
  };
  document.body.addEventListener("transitionrun", onTransitionStart);
  document.body.addEventListener("transitionend", onTransitionEnd);
}
if (typeof document !== "undefined") {
  if (document.readyState !== "loading") {
    setupGlobalEvents();
  } else {
    document.addEventListener("DOMContentLoaded", setupGlobalEvents);
  }
}
function runAfterTransition(fn) {
  requestAnimationFrame(() => {
    if (transitionsByElement.size === 0) {
      fn();
    } else {
      transitionCallbacks.add(fn);
    }
  });
}

// src/scroll-into-view.ts
function scrollIntoView(scrollView, element) {
  const offsetX = relativeOffset(scrollView, element, "left");
  const offsetY = relativeOffset(scrollView, element, "top");
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  let x = scrollView.scrollLeft;
  let y = scrollView.scrollTop;
  const maxX = x + scrollView.offsetWidth;
  const maxY = y + scrollView.offsetHeight;
  if (offsetX <= x) {
    x = offsetX;
  } else if (offsetX + width > maxX) {
    x += offsetX + width - maxX;
  }
  if (offsetY <= y) {
    y = offsetY;
  } else if (offsetY + height > maxY) {
    y += offsetY + height - maxY;
  }
  scrollView.scrollLeft = x;
  scrollView.scrollTop = y;
}
function relativeOffset(ancestor, child, axis) {
  const prop = axis === "left" ? "offsetLeft" : "offsetTop";
  let sum = 0;
  while (child.offsetParent) {
    sum += child[prop];
    if (child.offsetParent === ancestor) {
      break;
    } else if (child.offsetParent.contains(ancestor)) {
      sum -= ancestor[prop];
      break;
    }
    child = child.offsetParent;
  }
  return sum;
}
function scrollIntoViewport(targetElement, opts) {
  if (document.contains(targetElement)) {
    const root = document.scrollingElement || document.documentElement;
    const isScrollPrevented = window.getComputedStyle(root).overflow === "hidden";
    if (!isScrollPrevented) {
      const { left: originalLeft, top: originalTop } = targetElement.getBoundingClientRect();
      targetElement?.scrollIntoView?.({ block: "nearest" });
      const { left: newLeft, top: newTop } = targetElement.getBoundingClientRect();
      if (Math.abs(originalLeft - newLeft) > 1 || Math.abs(originalTop - newTop) > 1) {
        opts?.containingElement?.scrollIntoView?.({ block: "center", inline: "center" });
        targetElement.scrollIntoView?.({ block: "nearest" });
      }
    } else {
      let scrollParent = getScrollParent(targetElement);
      while (targetElement && scrollParent && targetElement !== root && scrollParent !== root) {
        scrollIntoView(scrollParent, targetElement);
        targetElement = scrollParent;
        scrollParent = getScrollParent(targetElement);
      }
    }
  }
}

// src/styles.ts
var visuallyHiddenStyles = {
  border: "0",
  clip: "rect(0 0 0 0)",
  "clip-path": "inset(50%)",
  height: "1px",
  margin: "0 -1px -1px 0",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  "white-space": "nowrap"
};
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit-utils/src/array.ts
 */
/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/assertion.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/solidjs-community/solid-aria/blob/2c5f54feb5cfea514b1ee0a52d0416878f882351/packages/utils/src/createGlobalListeners.ts
 */
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit-utils/src/dom.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/cf9ab24f3255be1530d0f584061a01aa1e8180e6/packages/@react-aria/utils/src/platform.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/focusWithoutScrolling.ts
 */
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/main/packages/ariakit-utils/src/focus.ts
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/focus/src/isElementVisible.ts
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/focus/src/FocusScope.tsx
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/f6e686fe9d3b983d48650980c1ecfdde320bc62f/packages/@react-aria/focus/src/FocusScope.tsx
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/getScrollParent.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/isVirtualEvent.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/ff3e690fffc6c54367b8057e28a0e5b9211f37b5/packages/@react-stately/utils/src/number.ts
 */
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/__utils/polygon.ts
 * https://github.com/ariakit/ariakit/blob/f2a96973de523d67e41eec983263936c489ef3e2/packages/ariakit/src/hovercard/__utils/debug-polygon.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/runAfterTransition.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/utils/src/scrollIntoView.ts
 */

Object.defineProperty(exports, 'createEventListener', {
  enumerable: true,
  get: function () { return eventListener.createEventListener; }
});
Object.defineProperty(exports, 'Key', {
  enumerable: true,
  get: function () { return keyed.Key; }
});
Object.defineProperty(exports, 'ReactiveMap', {
  enumerable: true,
  get: function () { return map.ReactiveMap; }
});
Object.defineProperty(exports, 'createMediaQuery', {
  enumerable: true,
  get: function () { return media.createMediaQuery; }
});
Object.defineProperty(exports, 'combineProps', {
  enumerable: true,
  get: function () { return props.combineProps; }
});
Object.defineProperty(exports, 'mergeRefs', {
  enumerable: true,
  get: function () { return refs.mergeRefs; }
});
Object.defineProperty(exports, 'access', {
  enumerable: true,
  get: function () { return utils.access; }
});
Object.defineProperty(exports, 'accessWith', {
  enumerable: true,
  get: function () { return utils.accessWith; }
});
Object.defineProperty(exports, 'chain', {
  enumerable: true,
  get: function () { return utils.chain; }
});
exports.EventKey = EventKey;
exports.FOCUSABLE_ELEMENT_SELECTOR = FOCUSABLE_ELEMENT_SELECTOR;
exports.TABBABLE_ELEMENT_SELECTOR = TABBABLE_ELEMENT_SELECTOR;
exports.addItemToArray = addItemToArray;
exports.callHandler = callHandler;
exports.clamp = clamp;
exports.composeEventHandlers = composeEventHandlers;
exports.contains = contains;
exports.createFocusManager = createFocusManager;
exports.createGenerateId = createGenerateId;
exports.createGlobalListeners = createGlobalListeners;
exports.debugPolygon = debugPolygon;
exports.focusWithoutScrolling = focusWithoutScrolling;
exports.getActiveElement = getActiveElement;
exports.getAllTabbableIn = getAllTabbableIn;
exports.getDocument = getDocument;
exports.getEventPoint = getEventPoint;
exports.getFocusableTreeWalker = getFocusableTreeWalker;
exports.getScrollParent = getScrollParent;
exports.getWindow = getWindow;
exports.hasFocusWithin = hasFocusWithin;
exports.isAndroid = isAndroid;
exports.isAppleDevice = isAppleDevice;
exports.isArray = isArray;
exports.isChrome = isChrome;
exports.isCtrlKey = isCtrlKey;
exports.isElementVisible = isElementVisible;
exports.isFocusable = isFocusable;
exports.isFrame = isFrame;
exports.isFunction = isFunction;
exports.isIOS = isIOS;
exports.isIPad = isIPad;
exports.isIPhone = isIPhone;
exports.isMac = isMac;
exports.isNumber = isNumber;
exports.isPointInPolygon = isPointInPolygon;
exports.isString = isString;
exports.isTabbable = isTabbable;
exports.isVirtualClick = isVirtualClick;
exports.isVirtualPointerEvent = isVirtualPointerEvent;
exports.isWebKit = isWebKit;
exports.mergeDefaultProps = mergeDefaultProps;
exports.noop = noop;
exports.removeItemFromArray = removeItemFromArray;
exports.runAfterTransition = runAfterTransition;
exports.scrollIntoView = scrollIntoView;
exports.scrollIntoViewport = scrollIntoViewport;
exports.snapValueToStep = snapValueToStep;
exports.visuallyHiddenStyles = visuallyHiddenStyles;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map