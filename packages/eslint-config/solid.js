/**
 *
 * @type {import('eslint').Linter.Config}
 */

module.exports = {
  extends: ['./base.js', 'plugin:solid/typescript'],
  env: {
    browser: true,
  },
  plugins: ['solid'],
};
