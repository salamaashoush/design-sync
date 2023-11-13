import fs from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathExists } from 'path-exists';
export async function writeFileAsync(outputFilePath, fileContents) {
    const directoryPath = dirname(outputFilePath);
    if ((await pathExists(directoryPath)) === false) {
        await fs.mkdir(directoryPath, { recursive: true });
    }
    await fs.writeFile(outputFilePath, fileContents);
}
//# sourceMappingURL=write-file-async.js.map