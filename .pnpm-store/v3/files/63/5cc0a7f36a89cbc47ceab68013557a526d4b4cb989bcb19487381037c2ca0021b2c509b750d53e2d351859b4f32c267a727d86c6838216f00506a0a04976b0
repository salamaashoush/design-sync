import fs from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';
import cssNano from 'cssnano';
import { findUp } from 'find-up';
import { pathExists } from 'path-exists';
import postcss from 'postcss';
import postCssModules from 'postcss-modules';
import revHash from 'rev-hash';
import tempWrite from 'temp-write';
export function esbuildCssModulesPlugin(minify) {
    return {
        name: 'css-modules',
        setup: function (build) {
            build.onResolve({ filter: /\.css$/ }, async function (args) {
                const { path, isGlobalCss } = parseCssFilePath(args.path);
                const cssfilePath = await createCssFilePathAsync(path, args.resolveDir);
                if (cssfilePath === null ||
                    (await pathExists(cssfilePath)) === false) {
                    throw new Error(`CSS file not found: ${args.path}`);
                }
                const js = isGlobalCss
                    ? await createGlobalCssJavaScriptAsync(cssfilePath, minify)
                    : await createCssModulesJavaScriptAsync(cssfilePath, minify);
                const jsFilePath = await tempWrite(js, `${basename(args.path, extname(args.path))}.js`);
                return {
                    path: jsFilePath
                };
            });
        }
    };
}
function parseCssFilePath(path) {
    if (path[0] === '!') {
        return {
            isGlobalCss: true,
            path: path.slice(1)
        };
    }
    return {
        isGlobalCss: false,
        path
    };
}
async function createCssFilePathAsync(path, resolveDirectory) {
    if (path[0] === '/') {
        return path;
    }
    if (path[0] === '.') {
        return resolve(resolveDirectory, path);
    }
    const result = await findUp(join('node_modules', path));
    if (typeof result === 'undefined') {
        return null;
    }
    return result;
}
const backQuoteRegex = /`/g;
const backSlashColonRegex = /\\:/g;
async function createGlobalCssJavaScriptAsync(cssFilePath, minify) {
    let css = await fs.readFile(cssFilePath, 'utf8');
    if (minify === true) {
        const plugins = [cssNano()];
        const result = await postcss(plugins).process(css, {
            from: cssFilePath,
            map: minify === true
                ? false
                : {
                    inline: true
                }
        });
        css = result.css;
    }
    const elementId = revHash(cssFilePath);
    const isBaseCss = cssFilePath.indexOf('@create-figma-plugin/ui/lib/css/base.css') !== -1;
    return `
    if (document.getElementById('${elementId}') === null) {
      const element = document.createElement('style');
      element.id = '${elementId}';
      element.innerHTML = \`${css
        .replace(backQuoteRegex, '\\`')
        .replace(backSlashColonRegex, '\\\\:')}\`;
      document.head.${isBaseCss === true ? 'prepend' : 'append'}(element);
    }
    export default {};
  `;
}
async function createCssModulesJavaScriptAsync(cssFilePath, minify) {
    let css = await fs.readFile(cssFilePath, 'utf8');
    let classNamesJson = null;
    const plugins = [];
    plugins.push(postCssModules({
        getJSON: function (_, json) {
            if (classNamesJson !== null) {
                throw new Error('`getJSON` callback called more than once');
            }
            classNamesJson = JSON.stringify(json);
        }
    }));
    if (minify === true) {
        plugins.push(cssNano());
    }
    const result = await postcss(plugins).process(css, {
        from: cssFilePath,
        map: minify === true
            ? false
            : {
                inline: true
            }
    });
    css = result.css;
    if (classNamesJson === null) {
        throw new Error('`getJSON` callback was not called');
    }
    const elementId = revHash(cssFilePath);
    return `
    if (document.getElementById('${elementId}') === null) {
      const element = document.createElement('style');
      element.id = '${elementId}';
      element.textContent = \`${css
        .replace(backQuoteRegex, '\\`')
        .replace(backSlashColonRegex, '\\\\:')}\`;
      document.head.append(element);
    }
    export default ${classNamesJson};
  `;
}
//# sourceMappingURL=esbuild-css-modules-plugin.js.map