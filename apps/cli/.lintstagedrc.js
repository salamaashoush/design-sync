module.exports = {
  // eslint
  'src/**/*.{js,jsx,ts,tsx}': 'eslint --config ../../.eslintrc.ci.js',

  // tsc
  'src/**/*.{ts,tsx}': () => 'tsc',
};
