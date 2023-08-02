import { createIdGenerator } from '@tokenize/utils';
import mitt from 'mitt';
import type { RpcCallParams } from './calls';
import type { RpcPort } from './port';
import type { JsonRpcResponse } from './types';
import { isJsonRpcResponse, isJsonRpcSubscription } from './utils';

interface RpcClientEvents extends RpcChannelData {
  response: JsonRpcResponse;
}

export class RpcClient {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  private emitter = mitt<RpcClientEvents>();
  private idGenerator = createIdGenerator();

  constructor(private port: RpcPort) {
    this.port.addEventListener('message', this.onMessage);
  }

  private onMessage = (event: MessageEvent) => {
    console.log('onMessage client', event);
    const res = event.data.pluginMessage;

    if (isJsonRpcSubscription(res)) {
      this.emitter.emit(res.params.channel, res.params.data);
      return;
    }

    if (isJsonRpcResponse(res)) {
      this.emitter.emit('response', res);
      return;
    }
  };

  private getId() {
    return this.idGenerator.next().value;
  }

  async call<Method extends keyof RpcCalls>(
    method: Method,
    ...args: RpcCallParams<Method>
  ): Promise<RpcCalls[Method]['res']['result']> {
    const params = args[0];
    const id = this.getId();
    const req = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };
    this.port.postMessage(req, '*');

    return new Promise((resolve, reject) => {
      const handler = (res: JsonRpcResponse) => {
        if (res.id !== id) return;
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.result);
        }
        this.emitter.off('response', handler);
      };
      this.emitter.on('response', handler);
    });
  }

  async subscribe<Channel extends keyof RpcChannelData>(channel: Channel | Channel[]) {
    const channels = Array.isArray(channel) ? channel : [channel];

    await this.call('subscribe', {
      channels,
    });

    return () => {
      this.call('unsubscribe', {
        channels,
      });
    };
  }

  on<Channel extends keyof RpcChannelData>(channel: Channel, handler: (data: RpcChannelData[Channel]) => void) {
    this.emitter.on(channel, handler);
  }

  off<Channel extends keyof RpcChannelData>(channel: Channel, handler: (data: RpcChannelData[Channel]) => void) {
    this.emitter.off(channel, handler);
  }

  once<Channel extends keyof RpcChannelData>(channel: Channel, handler: (data: RpcChannelData[Channel]) => void) {
    const onceHandler = (data: RpcChannelData[Channel]) => {
      handler(data);
      this.emitter.off(channel, onceHandler);
    };
    this.emitter.on(channel, onceHandler);
  }

  destroy() {
    this.emitter.all.clear();
    this.port?.removeEventListener('message', this.onMessage);
  }
}
