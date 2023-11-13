/**
 *
 * @type {import('eslint').Linter.Config}
 */

module.exports = {
  extends: ['./base.js', 'preact'],
  env: {
    browser: true,
  },
  plugins: ['solid'],
};
