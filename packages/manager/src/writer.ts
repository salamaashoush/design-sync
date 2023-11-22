import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import prettier from 'prettier';

type Format = 'typescript' | 'json' | 'css';
export async function formatTextWithPrettier(text: string, parser: Format = 'typescript') {
  const configFile = await prettier.resolveConfigFile();

  let config: prettier.Options = {};
  if (configFile) {
    const loadedConfig = await prettier.resolveConfig(configFile);
    if (loadedConfig) {
      config = loadedConfig;
    }
  }

  return prettier.format(text, { ...config, parser });
}

function detectFileFormat(path: string) {
  const ext = path.split('.').pop();
  switch (ext) {
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    default:
      return 'typescript';
  }
}
export async function formatAndWriteFile(path: string, content: string, prettify = false) {
  const format = detectFileFormat(path);
  const folderPath = path.split('/').slice(0, -1).join('/');
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }
  if (prettify) {
    content = await formatTextWithPrettier(content, format);
  }
  return writeFile(path, content);
}
