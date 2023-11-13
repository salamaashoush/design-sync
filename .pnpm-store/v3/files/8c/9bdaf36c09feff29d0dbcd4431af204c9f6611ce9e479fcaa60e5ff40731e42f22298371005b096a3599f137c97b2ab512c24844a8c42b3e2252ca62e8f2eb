import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findUp } from 'find-up';
const __dirname = dirname(fileURLToPath(import.meta.url));
export function esbuildPreactCompatPlugin() {
    return {
        name: 'preact-compat',
        setup: function (build) {
            build.onResolve({ filter: /^react(?:-dom)?$/ }, async function () {
                const preactCompatPath = await findUp(join('node_modules', 'preact', 'compat', 'dist', 'compat.module.js'), { cwd: __dirname });
                if (typeof preactCompatPath === 'undefined') {
                    throw new Error('Cannot find `preact`');
                }
                return { path: preactCompatPath };
            });
        }
    };
}
//# sourceMappingURL=esbuild-preact-compat-plugin.js.map