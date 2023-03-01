import { server } from '../rpc';
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

figma.ui.resize(500, 700);
figma.showUI(__html__);
