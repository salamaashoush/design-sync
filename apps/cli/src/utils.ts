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
