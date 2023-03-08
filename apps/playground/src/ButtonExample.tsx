import { Button } from '@tokenize/uikit';

export function ButtonExample() {
  return (
    <div>
      <h1>Button</h1>
      <Button intent="primary">Primary</Button>
      <Button intent="primary" disabled>
        Primary
      </Button>
      <Button intent="primary" destructive>
        Primary destructive
      </Button>
      <Button intent="primary" destructive disabled>
        Primary destructive
      </Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="secondary" disabled>
        Secondary
      </Button>
      <Button intent="secondary" destructive>
        Secondary destructive
      </Button>
      <Button intent="secondary" destructive disabled>
        Secondary destructive
      </Button>
    </div>
  );
}
