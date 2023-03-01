import { Component, createResource, onCleanup, onMount, Show } from 'solid-js';
import { client } from '../rpc';
import { Token, TokenSet } from '../types';
import { ModalsProvider } from './common/Modal';
import { Resizable, ResizableEvent } from './common/Resizable';
import { Tokens } from './Tokens';

const App: Component = () => {
  const [setsRes] = createResource(() => client.call('tokens/get'));
  // const [selection, setSelectedSets] = createSignal<RpcChannelData['selectionchange']['selection']>([]);

  const handleTokenClick = (args: [string, Token]) => {
    client.call('tokens/apply', {
      path: args[0],
      token: args[1],
      target: 'selection',
    });
  };

  const handleResize = (event: ResizableEvent) => {
    client.call('resize', event);
  };

  onMount(() => {
    client.on('selectionchange', ({ selection }) => {
      console.log('selectionchange', selection);
      // setSelectedSets(selection);
    });

    client.subscribe('selectionchange').then((unsubscribe) => {
      onCleanup(() => {
        unsubscribe();
      });
    });
  });

  return (
    <ModalsProvider>
      <Resizable onResize={handleResize}>
        <Show when={setsRes()?.sets} fallback={<div>Loading...</div>}>
          <Tokens sets={setsRes()?.sets as TokenSet[]} onTokenClick={handleTokenClick} />
        </Show>
      </Resizable>
    </ModalsProvider>
  );
};

export default App;
