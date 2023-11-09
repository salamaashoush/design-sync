module.exports = {
  // eslint
  'src/**/*.{js,jsx,ts,tsx}': ' eslint',

  // tsc
  'src/**/*.{ts,tsx}': () => 'tsc',
};
