import { Tabs } from '@design-sync/uikit';
import { Export } from './Export';
import { Import } from './Import';

export function Dashboard() {
  return (
    <Tabs
      tabs={[
        { value: 'export', label: 'Export', content: <Export /> },
        { value: 'import', label: 'Import', content: <Import /> },
      ]}
    />
  );
}
