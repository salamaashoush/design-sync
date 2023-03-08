// eslint-disable-next-line import/no-unresolved
import '@tokenize/uikit/src/figma-themes.css';
// eslint-disable-next-line import/no-unresolved
import '@unocss/reset/tailwind.css';
import 'uno.css';

import { render } from 'solid-js/web';

import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

if (root) {
  render(() => <App />, root);
}
