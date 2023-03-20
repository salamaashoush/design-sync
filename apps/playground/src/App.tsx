import { Button, Checkbox, Dialog, Input, Label, Radio, RadioGroup, SectionTitle, Select } from '@tokenize/uikit';
import { Component, createEffect, createSignal } from 'solid-js';
import { ButtonExample } from './ButtonExample';
import { CollapsibleExample } from './CollapsibleExample';
import { IconsExample } from './IconsExample';
import { TypographyExample } from './TypographyExample';

const App: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [theme, setTheme] = createSignal('figma-light');

  createEffect(() => {
    document.body.classList.remove('figma-dark');
    document.body.classList.remove('figma-light');
    document.body.classList.add(theme());
  });

  return (
    <div>
      <select name="theme" id="theme" onChange={(e) => setTheme(e.currentTarget.value)}>
        <option value="figma-light">Light</option>
        <option value="figma-dark">Dark</option>
      </select>
      <h1>Playground to try components</h1>

      <ButtonExample />
      <CollapsibleExample />
      <TypographyExample />
      <IconsExample />

      <h2>Checkbox</h2>
      <Checkbox label="Checkbox" />
      <Checkbox label="Checkbox" isChecked />
      <Checkbox label="Checkbox" isDisabled />
      <Checkbox label="Checkbox" isChecked isDisabled />

      <h2>Radio</h2>
      <RadioGroup name="gender">
        <Radio label="Male" value="male" />
        <Radio label="Female" value="female" />
      </RadioGroup>

      {/* <h2>IconButton</h2>
      <IconButton icon={<Icon name="angle" />} />
      <IconButton icon={<Icon name="angle" />} selected /> */}

      <h2>Input</h2>
      <Input placeholder="Placeholder" />
      <Input placeholder="Placeholder" disabled />
      <Input placeholder="Placeholder" value="Value" />
      <Input placeholder="Placeholder" value="Value" disabled />
      {/* <Input icon={<Icon name="adjust" />} placeholder="Placeholder" /> */}

      <h2>Typography</h2>
      <SectionTitle>Section Title</SectionTitle>
      <Label>Label</Label>

      {/* <h2>OnboardingTip</h2>
      <OnboardingTip icon={<Icon name="adjust" />}>
        <p>Onboarding tip</p>
      </OnboardingTip> */}

      <h2>Select</h2>
      <Select items={[{ label: 'Option 1', value: 'option-1' }]} />

      <h2>Dialog</h2>
      <Button
        intent="primary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Show
      </Button>
      <Dialog
        title="Hello"
        isOpen={isOpen()}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen);
        }}
      >
        <p>World</p>
      </Dialog>
    </div>
  );
};

export default App;
