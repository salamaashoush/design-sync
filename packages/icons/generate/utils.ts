import { load } from 'cheerio';
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { optimize } from 'svgo';
import { svgoConfig } from './svgo-config';
import { iconComponentTemplate } from './template';

function removeExtension(fileName: string) {
  return fileName.split('.')[0];
}

export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/[-_]+/g, '');
}

export function formatFileName(filePath: string) {
  const splittedPath = filePath.replaceAll('\\', '/').split('/');
  const name = splittedPath[splittedPath.length - 1];
  const rawFileName = removeExtension(name);

  const nameTemplate = pascalCase(rawFileName);
  if (nameTemplate.endsWith('Icon')) {
    return nameTemplate;
  }
  return `${nameTemplate}Icon`;
}

export async function formatWithPrettier(code: string, parser = 'typescript') {
  const config = await prettier.resolveConfig(process.cwd());
  return prettier.format(code, { ...config, parser });
}

export interface SVGAttribs {
  viewBox?: string;
  height?: string;
  width?: string;
  stroke?: string;
}

export interface IconContent {
  contents: string;
  svgAttribs: SVGAttribs;
  fileName: string;
}

export async function getSvgFiles(dirPath: string, files: string[] = []): Promise<string[]> {
  const paths = await readdir(dirPath);

  for (let current = 0; current < paths.length; current++) {
    const file = paths[current];
    const states = await stat(`${dirPath}/${file}`);
    if (states.isDirectory()) {
      files = await getSvgFiles(`${dirPath}/${file}`, files);
    } else if (file.includes('.svg')) {
      files.push(path.join(dirPath, '/', file));
    }
  }

  return files;
}

export async function optimizeContents(contents: string) {
  return optimize(contents, svgoConfig);
}

export async function getIconContent(path: string): Promise<IconContent> {
  const rawFile = await readFile(path, 'utf-8');
  const optimizeFile = await optimizeContents(rawFile);

  const $ = load(optimizeFile.data, { xmlMode: true });
  const mountedElement = $('svg');

  const { children, attribs } = mountedElement[0];

  return {
    fileName: formatFileName(path),
    contents: children
      .reduce((prev: string[], current) => (current.type === 'tag' ? [...prev, $.html(current)] : prev), [])
      .join(''),
    svgAttribs: attribs,
  };
}

export async function writeComponentsFiles(icons: IconContent[], outDir: string) {
  await mkdir(outDir);

  // write each icon to a new file
  await Promise.all(
    icons.map(async (icon) => {
      const filePath = `${outDir}/${icon.fileName}.tsx`;
      const code = await formatWithPrettier(iconComponentTemplate(icon));
      await writeFile(filePath, code);
    }),
  );

  // create index.ts file
  const bundlePath = `${outDir}/index.ts`;
  await writeFile(bundlePath, icons.map((icon) => `export { ${icon.fileName} } from "./${icon.fileName}";`).join('\n'));
}
