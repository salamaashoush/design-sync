import { server } from '../server';

export function setupStylesHandlers() {
  server.handle('styles/get', async () => {
    const typography = figma.getLocalTextStyles().map((s) => ({
      id: s.id,
      name: s.name,
    }));
    const shadows = figma.getLocalEffectStyles().flatMap((s) =>
      s.effects
        .filter((e) => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
        .map((e) => ({
          id: s.id,
          name: s.name,
        })),
    );

    const gradients = figma.getLocalPaintStyles().flatMap((s) =>
      s.paints
        .filter((p) => p.type.includes('GRADIENT'))
        .map(() => ({
          id: s.id,
          name: s.name,
        })),
    );

    return {
      typography,
      shadows,
      gradients,
    };
  });
}
