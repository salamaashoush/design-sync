import { server } from '../rpc/server';
import './rpcHandlers';

figma.on('selectionchange', () => {
  const nodes = figma.currentPage.selection;
  server.emit('selectionchange', {
    selection: nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      data: node.getPluginDataKeys().map((key) => ({
        key,
        value: node.getPluginData(key),
      })),
    })),
  });
});

figma.showUI(__html__, { themeColors: true, width: 500, height: 700, title: 'Tokenize' });
