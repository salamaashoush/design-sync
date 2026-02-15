import { useState } from 'react';
import { lightTheme } from './tokens/light.css';
import { tokens } from './tokens/contract.css';
import * as styles from './App.css';

// ============================================================================
// Demo Components
// ============================================================================

function SpacingDemo() {
  const spacings = [
    { name: 'no', token: tokens.kda.foundation.spacing.no },
    { name: 'xxs', token: tokens.kda.foundation.spacing.xxs },
    { name: 'xs', token: tokens.kda.foundation.spacing.xs },
    { name: 'sm', token: tokens.kda.foundation.spacing.sm },
    { name: 'md', token: tokens.kda.foundation.spacing.md },
    { name: 'lg', token: tokens.kda.foundation.spacing.lg },
    { name: 'xl', token: tokens.kda.foundation.spacing.xl },
    { name: 'xxl', token: tokens.kda.foundation.spacing.xxl },
    { name: 'xxxl', token: tokens.kda.foundation.spacing.xxxl },
  ];

  return (
    <section className={styles.demoSection}>
      <h2 className={styles.sectionTitle}>Spacing Tokens</h2>
      <p className={styles.description}>
        Using <code>tokens.kda.foundation.spacing.*</code> for consistent spacing
      </p>
      <div className={styles.spacingGrid}>
        {spacings.map((s) => (
          <div key={s.name} className={styles.spacingItem}>
            <div
              className={styles.spacingBox}
              style={{ width: s.token, height: s.token }}
            />
            <span className={styles.tokenName}>{s.name}</span>
            <code className={styles.tokenVar}>{s.token}</code>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionSubtitle}>Spacing in Action</h3>
      <div className={styles.spacingExample}>
        <div className={styles.card} style={{ padding: tokens.kda.foundation.spacing.md }}>
          <p>Padding: <code>spacing.md</code></p>
        </div>
        <div className={styles.card} style={{ padding: tokens.kda.foundation.spacing.lg }}>
          <p>Padding: <code>spacing.lg</code></p>
        </div>
        <div className={styles.card} style={{ padding: tokens.kda.foundation.spacing.xl }}>
          <p>Padding: <code>spacing.xl</code></p>
        </div>
      </div>
    </section>
  );
}

function SizingDemo() {
  const sizes = [
    { name: 'n4', token: tokens.kda.foundation.size.n4 },
    { name: 'n6', token: tokens.kda.foundation.size.n6 },
    { name: 'n8', token: tokens.kda.foundation.size.n8 },
    { name: 'n10', token: tokens.kda.foundation.size.n10 },
    { name: 'n12', token: tokens.kda.foundation.size.n12 },
    { name: 'n16', token: tokens.kda.foundation.size.n16 },
    { name: 'n20', token: tokens.kda.foundation.size.n20 },
  ];

  return (
    <section className={styles.demoSection}>
      <h2 className={styles.sectionTitle}>Size Tokens</h2>
      <p className={styles.description}>
        Using <code>tokens.kda.foundation.size.*</code> for consistent sizing
      </p>
      <div className={styles.sizeGrid}>
        {sizes.map((s) => (
          <div key={s.name} className={styles.sizeItem}>
            <div
              className={styles.sizeBox}
              style={{ width: s.token, height: s.token }}
            />
            <span className={styles.tokenName}>{s.name}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionSubtitle}>Icon Sizes</h3>
      <div className={styles.iconSizes}>
        <div className={styles.iconDemo} style={{ width: tokens.kda.foundation.size.n4, height: tokens.kda.foundation.size.n4 }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className={styles.iconDemo} style={{ width: tokens.kda.foundation.size.n6, height: tokens.kda.foundation.size.n6 }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className={styles.iconDemo} style={{ width: tokens.kda.foundation.size.n8, height: tokens.kda.foundation.size.n8 }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function RadiusDemo() {
  const radii = [
    { name: 'no', token: tokens.kda.foundation.radius.no },
    { name: 'xs', token: tokens.kda.foundation.radius.xs },
    { name: 'sm', token: tokens.kda.foundation.radius.sm },
    { name: 'md', token: tokens.kda.foundation.radius.md },
    { name: 'lg', token: tokens.kda.foundation.radius.lg },
    { name: 'xl', token: tokens.kda.foundation.radius.xl },
    { name: 'xxl', token: tokens.kda.foundation.radius.xxl },
    { name: 'round', token: tokens.kda.foundation.radius.round },
  ];

  return (
    <section className={styles.demoSection}>
      <h2 className={styles.sectionTitle}>Border Radius Tokens</h2>
      <p className={styles.description}>
        Using <code>tokens.kda.foundation.radius.*</code> for consistent corners
      </p>
      <div className={styles.radiusGrid}>
        {radii.map((r) => (
          <div key={r.name} className={styles.radiusItem}>
            <div
              className={styles.radiusBox}
              style={{ borderRadius: r.token }}
            />
            <span className={styles.tokenName}>{r.name}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionSubtitle}>Button Styles</h3>
      <div className={styles.buttonDemo}>
        <button className={styles.btn} style={{ borderRadius: tokens.kda.foundation.radius.sm }}>
          Small Radius
        </button>
        <button className={styles.btn} style={{ borderRadius: tokens.kda.foundation.radius.md }}>
          Medium Radius
        </button>
        <button className={styles.btn} style={{ borderRadius: tokens.kda.foundation.radius.round }}>
          Round
        </button>
      </div>
    </section>
  );
}

function TransitionsDemo() {
  const [hovered, setHovered] = useState<string | null>(null);

  const transitions = [
    {
      id: 'base',
      name: 'Base (400ms)',
      token: tokens.kda.foundation.transition.duration.base,
    },
    {
      id: 'd200',
      name: 'Fast (200ms)',
      token: tokens.kda.foundation.transition.duration.d200,
    },
    {
      id: 'sine',
      name: 'Ease Out Sine',
      token: tokens.kda.foundation.transition.animation.easeOutSine,
    },
    {
      id: 'cubic',
      name: 'Ease Out Cubic',
      token: tokens.kda.foundation.transition.animation.easeOutCubic,
    },
  ];

  return (
    <section className={styles.demoSection}>
      <h2 className={styles.sectionTitle}>Transition Tokens</h2>
      <p className={styles.description}>
        Using <code>tokens.kda.foundation.transition.*</code> for animations
      </p>

      <div className={styles.transitionGrid}>
        {transitions.map((t) => (
          <div
            key={t.id}
            className={`${styles.transitionBox} ${hovered === t.id ? styles.transitionBoxHovered : ''}`}
            style={{ transition: `all ${t.token}` }}
            onMouseEnter={() => setHovered(t.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span>{t.name}</span>
            <code>{t.token}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Main App
// ============================================================================

function App() {
  const [activeTab, setActiveTab] = useState('spacing');

  return (
    <div className={`${lightTheme} ${styles.app}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vanilla Extract Plugin Example</h1>
        <p className={styles.subtitle}>Design tokens as type-safe CSS-in-JS</p>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'spacing' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('spacing')}
        >
          Spacing
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'sizing' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('sizing')}
        >
          Sizing
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'radius' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('radius')}
        >
          Border Radius
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'transitions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('transitions')}
        >
          Transitions
        </button>
      </nav>

      <main className={styles.content}>
        {activeTab === 'spacing' && <SpacingDemo />}
        {activeTab === 'sizing' && <SizingDemo />}
        {activeTab === 'radius' && <RadiusDemo />}
        {activeTab === 'transitions' && <TransitionsDemo />}
      </main>

      <footer className={styles.footer}>
        <p>
          Tokens imported from <code>./tokens/contract.css.ts</code> with theme from{' '}
          <code>./tokens/light.css.ts</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
