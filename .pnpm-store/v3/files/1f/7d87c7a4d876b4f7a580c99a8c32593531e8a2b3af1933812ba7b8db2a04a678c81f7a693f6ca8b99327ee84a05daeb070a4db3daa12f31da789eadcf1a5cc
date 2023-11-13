"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  componentStateStyles: () => componentStateStyles
});
module.exports = __toCommonJS(src_exports);
function makeDataAttribute(state) {
  return `[data-${state}]`;
}
function makeSelectorByOptions(selector, options) {
  if (options.not) {
    selector = `:not(${selector})`;
  }
  selector = `&${selector}`;
  if (options.parentSelector) {
    selector = `${options.parentSelector} ${selector}`;
  }
  return selector;
}
function componentStateStyles(styles, options) {
  const styleRule = { selectors: {} };
  const selectorOptions = {
    parentSelector: options?.parentSelector ?? void 0
  };
  if (styleRule.selectors) {
    for (const property in styles) {
      const { not, ...styleValues } = styles[property] ?? {};
      const dataAttrSelector = makeDataAttribute(property);
      if (not) {
        const selector2 = makeSelectorByOptions(dataAttrSelector, {
          parentSelector: selectorOptions.parentSelector,
          not: true
        });
        styleRule.selectors[selector2] = not || {};
      }
      const selector = makeSelectorByOptions(dataAttrSelector, {
        parentSelector: selectorOptions.parentSelector,
        not: false
      });
      styleRule.selectors[selector] = styleValues;
    }
  }
  return styleRule;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  componentStateStyles
});
