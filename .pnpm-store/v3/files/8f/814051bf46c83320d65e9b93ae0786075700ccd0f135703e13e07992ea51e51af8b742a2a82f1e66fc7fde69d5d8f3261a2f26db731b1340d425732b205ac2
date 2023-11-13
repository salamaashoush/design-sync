import { constants, log, readConfigAsync } from '@create-figma-plugin/common';
import { watch } from 'chokidar';
import { yellow } from 'kleur/colors';
import { buildBundlesAsync } from '../utilities/build-bundles-async/build-bundles-async.js';
import { buildCssModulesTypingsAsync } from '../utilities/build-css-modules-typings-async.js';
import { buildManifestAsync } from '../utilities/build-manifest-async.js';
import { trackElapsedTime } from '../utilities/track-elapsed-time.js';
import { typeCheckWatch } from '../utilities/type-check/type-check-watch.js';
import { watchIgnoreRegex } from './watch-ignore-regex.js';
const cssRegex = /\.css$/;
const packageJsonRegex = /^package\.json$/;
const mapChokidarWatchEventToLabel = {
    add: 'Added',
    change: 'Changed',
    unlink: 'Deleted'
};
export async function watchAsync(options) {
    const { minify, outputDirectory, typecheck } = options;
    let endTypeCheckWatch;
    if (typecheck === true) {
        endTypeCheckWatch = typeCheckWatch();
    }
    const watcher = watch([
        '**/*.{css,gif,jpeg,jpg,js,json,jsx,png,ts,tsx}',
        constants.build.mainConfigGlobPattern,
        constants.build.manifestConfigGlobPattern,
        constants.build.uiConfigGlobPattern,
        'package.json',
        'tsconfig.json'
    ], {
        ignored: function (path) {
            return watchIgnoreRegex.test(path) === true;
        }
    });
    watcher.on('ready', function () {
        if (typecheck === false) {
            log.info('Watching...');
        }
        watcher.on('all', async function (event, file) {
            if (typeof mapChokidarWatchEventToLabel[event] === 'undefined') {
                return;
            }
            try {
                const config = await readConfigAsync();
                if (typecheck === true && file.indexOf('tsconfig.json') !== -1) {
                    endTypeCheckWatch();
                }
                log.clearViewport();
                const getElapsedTime = trackElapsedTime();
                log.info(`${mapChokidarWatchEventToLabel[event]} ${yellow(file)}`);
                const promises = [];
                if (packageJsonRegex.test(file) === true) {
                    promises.push(buildManifestAsync({ config, minify, outputDirectory }));
                }
                else {
                    if (cssRegex.test(file) === true) {
                        promises.push(buildCssModulesTypingsAsync());
                    }
                }
                promises.push(buildBundlesAsync({ config, minify, outputDirectory }));
                await Promise.all(promises);
                log.success(`Built in ${getElapsedTime()}`);
                if (typecheck === false) {
                    log.info('Watching...');
                    return;
                }
                if (file.indexOf('tsconfig.json') !== -1) {
                    endTypeCheckWatch = typeCheckWatch();
                }
            }
            catch (error) {
                log.error(error.message);
            }
        });
    });
}
//# sourceMappingURL=watch-async.js.map