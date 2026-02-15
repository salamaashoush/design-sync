import { createSignal } from 'solid-js';

export type Screen = 'onboarding' | 'dashboard' | 'settings';

const [currentScreen, setScreen] = createSignal<Screen>('dashboard');

export function useRouter() {
  return {
    screen: currentScreen,
    navigate: setScreen,
  };
}
