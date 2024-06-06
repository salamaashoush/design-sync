import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getIconContent, getSvgFiles, writeComponentsFiles } from './utils';

async function main() {
  const outDir = resolve(process.cwd(), 'src', 'components');
  const iconsDir = resolve(process.cwd(), 'svgs');
  await rm(outDir, { force: true, recursive: true });
  const files = await getSvgFiles(iconsDir);
  const icons = await Promise.all(files.map((file) => getIconContent(file)));
  await writeComponentsFiles(icons, outDir);
}

main();
