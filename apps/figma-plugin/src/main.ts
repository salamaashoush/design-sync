import { showUI } from '@create-figma-plugin/utilities';
import { setupRpcServerHandlers } from './rpc/server';

export default function () {
  setupRpcServerHandlers();
  showUI({
    height: 640,
    width: 480,
  });
}
