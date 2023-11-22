import { Fragment, h } from 'preact';
import { Box } from '../../components/Box';
import { Section } from '../../components/Section';
import { useRpcQuery } from '../../hooks/useRpcCall';
import { CollectionListItem } from './CollectionIListtem';

interface CollectionListProps {
  isSelected: (id: string) => boolean;
  onSelect: (selected: boolean, id: string) => void;
}
export function CollectionList({ isSelected, onSelect }: CollectionListProps) {
  const { data } = useRpcQuery('variables/get', []);

  return (
    <Fragment>
      <Section title="Local collections">
        <Box direction="column" justify="space-between" align="flex-start" gap="small">
          {data?.local?.map((collection) => (
            <CollectionListItem
              label={collection.name}
              selected={isSelected(collection.id)}
              onSelect={(itemSelected) => {
                if (itemSelected) {
                  onSelect(true, collection.id);
                } else {
                  onSelect(false, collection.id);
                }
              }}
            />
          ))}
        </Box>
      </Section>

      <Section title="Library collections">
        <Box direction="column" justify="space-between" align="flex-start" gap="small">
          {data?.library?.map((collection) => (
            <CollectionListItem
              label={collection.name}
              selected={isSelected(collection.id)}
              onSelect={(itemSelected) => {
                if (itemSelected) {
                  onSelect(true, collection.id);
                } else {
                  onSelect(false, collection.id);
                }
              }}
            />
          ))}
        </Box>
      </Section>
    </Fragment>
  );
}
