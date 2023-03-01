import { server } from '../rpc';
import { Token } from '../types';
import { tokensService } from './tokensService';
import { applyTokenToNodes } from './utils/apply';

server.handle('tokens/get', async () => {
  console.log('handle', 'token-sets/get');
  const sets = await tokensService.getTokens();
  return { sets };
});

server.handle('resize', async ({ height, width }) => {
  figma.ui.resize(width, height);
});

server.handle('tokens/apply', async ({ token, path, target }) => {
  if (target === 'selection') {
    await applyTokenToNodes(token, path, figma.currentPage.selection);
  }

  if (target === 'page') {
    await applyTokenToNodes(token, path, figma.currentPage.children);
  }

  if (target === 'document') {
    const pages = figma.root.children;
    for (const page of pages) {
      await applyTokenToNodes(token, path, page.children);
    }
  }
});

server.handle('tokens/change-set', async ({ id }) => {
  tokensService.changeActiveSet(id);
  const selected = figma.currentPage.selection;
  for (const node of selected) {
    const data = node
      .getPluginDataKeys()
      .map((key) => {
        const path = node.getPluginData(key);
        if (!path) return undefined;
        return {
          token: tokensService.getTokenByRefOrPath(path),
          path,
        };
      })
      .filter(Boolean) as { token: Token; path: string }[];
    console.log(data);
    for (const { token, path } of data) {
      if (token) {
        await applyTokenToNodes(token, path, [node]);
      }
    }
  }
});
