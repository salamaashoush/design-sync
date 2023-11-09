import { Plus32Icon } from '@design-sync/figma-icons';
import { Collapsible, IconButton } from '@design-sync/uikit';

export function CollapsibleExample() {
  return (
    <Collapsible title="Collapsible">
      <Collapsible title="Simple">
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Section" section>
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Control" control={<IconButton icon={<Plus32Icon color="red" />} />}>
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Section with control" section control={<IconButton icon={<Plus32Icon />} />}>
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Disabled" disabled>
        <p>Content</p>
      </Collapsible>
    </Collapsible>
  );
}
