import { Button } from '@create-figma-plugin/ui';
import { useComputed, useSignal } from '@preact/signals';
import { Fragment } from 'preact';
import { useCallback } from 'preact/hooks';
import { Box } from '../../components/Box';
import { Section } from '../../components/Section';
import { useRpcMutation } from '../../hooks/useRpcCall';
import { CollectionListItem } from './CollectionIListtem';
import { CollectionList } from './CollectionList';

export function Tokens() {
  const { mutateAsync } = useRpcMutation('tokens/sync');
  const exportTypography = useSignal(false);
  const exportShadows = useSignal(false);
  const exportPaints = useSignal(false);

  const selected = useSignal<string[]>([]);
  const canExport = useComputed(
    () => selected.value.length > 0 || exportTypography.value || exportShadows.value || exportPaints.value,
  );
  const isSelected = useCallback((id: string) => selected.value.includes(id), [selected]);
  const onSelect = useCallback(
    (itemSelected: boolean, id: string) => {
      if (itemSelected) {
        selected.value = [...selected.value, id];
      } else {
        selected.value = selected.value.filter((item) => item !== id);
      }
    },
    [selected],
  );

  const handleTokensSync = useCallback(() => {
    mutateAsync([
      {
        collections: selected.value,
        exportTypography: exportTypography.value,
        exportShadows: exportShadows.value,
        exportPaints: exportPaints.value,
      },
    ]);
  }, []);

  return (
    <Fragment>
      <Section
        title="Variable Collections & Styles"
        action={
          <Button onClick={handleTokensSync} disabled={!canExport.value}>
            Sync
          </Button>
        }
      />
      <CollectionList isSelected={isSelected} onSelect={onSelect} />
      <Section title="Styles">
        <Box flexDirection="column" gap="extraSmall">
          <CollectionListItem
            label="Text Styles"
            selected={exportTypography.value}
            onSelect={(selected) => (exportTypography.value = selected)}
          />
          <CollectionListItem
            label="Shadows"
            selected={exportShadows.value}
            onSelect={(selected) => (exportShadows.value = selected)}
          />
          <CollectionListItem
            label="Paint Styles (Gradient, Solid)"
            selected={exportPaints.value}
            onSelect={(selected) => (exportPaints.value = selected)}
          />
        </Box>
      </Section>
    </Fragment>
  );
}
