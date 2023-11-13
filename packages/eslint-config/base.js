/**
 *
 * @type {import('eslint').Linter.Config}
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    es2021: true,
  },
  plugins: ['simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }], // Allow unused variables starting with _ (e.g. _foo)
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
