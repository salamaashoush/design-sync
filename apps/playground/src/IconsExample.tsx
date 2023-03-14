import { theme } from '@tokenize/design-tokens';
import * as Icons from '@tokenize/figma-icons';
import { For } from 'solid-js';

export function IconsExample() {
  return (
    <div>
      <h1>Icons</h1>
      <div style={{ display: 'flex', color: theme.color.text, width: '100%', 'flex-shrink': 0, 'flex-wrap': 'wrap' }}>
        <For each={Object.keys(Icons)}>
          {(key) => {
            // eslint-disable-next-line import/namespace
            const Icon = Icons[key as keyof typeof Icons];
            return (
              <div
                style={{
                  display: 'flex',
                  'flex-direction': 'column',
                  'align-items': 'center',
                  margin: '1rem',
                }}
              >
                <Icon />
                <div>{key}</div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
