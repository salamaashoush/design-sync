import { LoadingIndicator, Tabs, TabsOption } from '@create-figma-plugin/ui';
import { useSignal } from '@preact/signals';
import { Fragment, JSX, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Box } from './components/Box';
import { useRpcQuery } from './hooks/useRpcCall';
import { Settings } from './screens/Settings/Settings';
import { Tokens } from './screens/Tokens/Tokens';

const TABS: TabsOption[] = [
  {
    value: 'Tokens',
    children: <Tokens />,
  },
  {
    value: 'Settings',
    children: <Settings />,
  },
];

export function App() {
  const { isLoading } = useRpcQuery('init');
  const tab = useSignal(TABS[0].value);
  const handleTabChange = useCallback((event: JSX.TargetedEvent<HTMLInputElement>) => {
    tab.value = event.currentTarget.value;
  }, []);

  return (
    <Fragment>
      {isLoading ? (
        <Box placeItems="center">
          <LoadingIndicator />
        </Box>
      ) : (
        <Tabs options={TABS} value={tab.value} onChange={handleTabChange} />
      )}
    </Fragment>
  );
}
