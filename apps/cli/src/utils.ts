import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import prettier from 'prettier';

export async function formatTextWithPrettier(text: string, parser = 'typescript') {
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

export async function writeFile(path: string, content: string) {
  // check if the folder exists
  const folderPath = path.split('/').slice(0, -1).join('/');
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }
  const formattedContent = await formatTextWithPrettier(content);
  return writeFile(path, formattedContent);
}
