// eslint-disable-next-line import/no-unresolved
import 'uno.css';

import '@tokenize/uikit/src/figma-themes.css';
import '@unocss/reset/tailwind.css';

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
