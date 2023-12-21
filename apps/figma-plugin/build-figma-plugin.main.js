/**
 *
 * @param {import('esbuild').BuildOptions} buildOptions
 * @returns  {import('esbuild').BuildOptions}
 */
export default function (buildOptions) {
  return {
    ...buildOptions,
    mainFields: ['module', 'main', 'browser'],
  };
}
