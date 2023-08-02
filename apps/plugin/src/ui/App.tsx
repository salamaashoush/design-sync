import { Button, ModalsProvider, Resizable, ResizableEvent } from '@tokenize/uikit';
import { Component, Show, createResource, onCleanup, onMount } from 'solid-js';
import { client } from '../rpc/client';
import { Token, TokenSet } from '../types';
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
    client.on('selectionchange', ({}) => {
      // setSelectedSets(selection);
    });

    client.subscribe('selectionchange').then((unsubscribe) => {
      onCleanup(() => {
        unsubscribe();
      });
    });
  });

  const exportVariables = () => {
    client.call('variables/export');
  };

  const importVariables = () => {
    client.call('variables/import');
  };

  return (
    <ModalsProvider>
      <Resizable onResize={handleResize}>
        <Button onClick={exportVariables}>Export Variables</Button>
        <Button onClick={importVariables}>Import Variables</Button>

        <Show when={setsRes()?.sets} fallback={<div>Loading...</div>}>
          <Tokens sets={setsRes()?.sets as TokenSet[]} onTokenClick={handleTokenClick} />
        </Show>
      </Resizable>
    </ModalsProvider>
  );
};

export default App;
