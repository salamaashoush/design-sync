import { Checkbox, Text } from '@create-figma-plugin/ui';

interface CollectionListItemProps {
  label: string;
  selected?: boolean;
  onSelect: (selected: boolean) => void;
}
export function CollectionListItem({ label, selected, onSelect }: CollectionListItemProps) {
  return (
    <Checkbox label={label} value={!!selected} onValueChange={onSelect}>
      <Text>{label}</Text>
    </Checkbox>
  );
}
