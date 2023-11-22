import { render, useWindowResize } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useCallback } from 'preact/hooks';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { client } from './rpc/client';

const queryClient = new QueryClient();

function Plugin() {
  const onWindowResize = useCallback((windowSize: { width: number; height: number }) => {
    client.call('resize', windowSize);
  }, []);

  useWindowResize(onWindowResize, {
    minHeight: 640,
    minWidth: 480,
    resizeBehaviorOnDoubleClick: 'minimize',
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

// load vanilla-extract styles
export default render(Plugin);
