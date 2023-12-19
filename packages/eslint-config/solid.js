/**
 *
 * @type {import('eslint').Linter.Config}
 */

module.exports = {
  extends: ['./base.js', 'plugin:solid/typescript'],
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['solid'],
};
