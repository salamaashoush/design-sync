"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const recommended_1 = __importDefault(require("./recommended"));
const typescript = {
    plugins: recommended_1.default.plugins,
    rules: {
        ...recommended_1.default.rules,
        "solid/jsx-no-undef": [2, { typescriptEnabled: true }],
        "solid/no-unknown-namespaces": 0,
    },
};
module.exports = typescript;
