import { PlusIcon } from '@tokenize/figma-icons';
import { Collapsible, IconButton } from '@tokenize/uikit';

export function CollapsibleExample() {
  return (
    <div>
      <h1>Collapsible</h1>
      <Collapsible title="Simple">
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Section" section>
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Control" control={<IconButton icon={<PlusIcon color="red" />} />}>
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Section with control" section control={<IconButton icon={<PlusIcon />} />}>
        <p>Content</p>
      </Collapsible>

      <Collapsible title="Disabled" isDisabled>
        <p>Content</p>
      </Collapsible>
    </div>
  );
}
