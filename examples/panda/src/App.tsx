import { useState } from 'react';
import { css } from '../styled-system/css';

// ============================================================================
// Styles using Panda CSS with Design Tokens
// ============================================================================

const appStyles = css({
  minHeight: '100vh',
  background: '#f8f9fa',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const headerStyles = css({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: 'kdaFoundationXl kdaFoundationLg',
  textAlign: 'center',
});

const titleStyles = css({
  margin: '0 0 {spacing.kdaFoundationXs}',
  fontSize: '2rem',
});

const subtitleStyles = css({
  margin: 0,
  opacity: 0.9,
});

const tabsStyles = css({
  display: 'flex',
  gap: 'kdaFoundationXs',
  padding: 'kdaFoundationMd',
  background: 'white',
  borderBottom: '1px solid #e9ecef',
  justifyContent: 'center',
});

const tabStyles = css({
  padding: 'kdaFoundationSm kdaFoundationMd',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: '#495057',
  borderRadius: 'kdaFoundationRadiusMd',
  transition: 'all 200ms',
  _hover: {
    background: '#f1f3f4',
  },
});

const tabActiveStyles = css({
  background: '#667eea',
  color: 'white',
  _hover: {
    background: '#5a6fd6',
  },
});

const contentStyles = css({
  maxWidth: '900px',
  margin: '0 auto',
  padding: 'kdaFoundationLg',
});

const sectionStyles = css({
  background: 'white',
  borderRadius: 'kdaFoundationRadiusLg',
  padding: 'kdaFoundationLg',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
});

const sectionTitleStyles = css({
  margin: '0 0 {spacing.kdaFoundationXs}',
  color: '#212529',
});

const sectionSubtitleStyles = css({
  margin: '{spacing.kdaFoundationLg} 0 {spacing.kdaFoundationMd}',
  color: '#495057',
  fontSize: '1rem',
});

const descriptionStyles = css({
  color: '#6c757d',
  marginBottom: 'kdaFoundationLg',
  '& code': {
    background: '#f1f3f4',
    padding: '0.125rem 0.375rem',
    borderRadius: 'kdaFoundationRadiusXs',
    fontSize: '0.875em',
  },
});

const footerStyles = css({
  textAlign: 'center',
  padding: 'kdaFoundationLg',
  color: '#6c757d',
  fontSize: '0.875rem',
  '& code': {
    background: '#f1f3f4',
    padding: '0.125rem 0.375rem',
    borderRadius: 'kdaFoundationRadiusXs',
  },
});

const spacingGridStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'kdaFoundationMd',
});

const spacingItemStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'kdaFoundationXs',
});

const spacingBoxStyles = css({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 'kdaFoundationRadiusXs',
  minWidth: '4px',
  minHeight: '4px',
});

const tokenNameStyles = css({
  fontWeight: 600,
  fontSize: '0.75rem',
});

const tokenVarStyles = css({
  fontSize: '0.625rem',
  color: '#6c757d',
  maxWidth: '120px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const spacingExampleStyles = css({
  display: 'flex',
  gap: 'kdaFoundationMd',
  flexWrap: 'wrap',
});

const cardStyles = css({
  background: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: 'kdaFoundationRadiusMd',
  flex: 1,
  minWidth: '150px',
  '& p': {
    margin: 0,
    fontSize: '0.75rem',
  },
});

const sizeGridStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'kdaFoundationLg',
  alignItems: 'flex-end',
});

const sizeItemStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'kdaFoundationXs',
});

const sizeBoxStyles = css({
  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  borderRadius: 'kdaFoundationRadiusSm',
});

const iconSizesStyles = css({
  display: 'flex',
  gap: 'kdaFoundationLg',
  alignItems: 'center',
});

const iconDemoStyles = css({
  color: '#667eea',
  '& svg': {
    width: '100%',
    height: '100%',
  },
});

const radiusGridStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'kdaFoundationLg',
});

const radiusItemStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'kdaFoundationXs',
});

const radiusBoxStyles = css({
  width: '60px',
  height: '60px',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
});

const buttonDemoStyles = css({
  display: 'flex',
  gap: 'kdaFoundationMd',
  flexWrap: 'wrap',
});

const btnStyles = css({
  padding: 'kdaFoundationSm kdaFoundationLg',
  border: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'transform 200ms, box-shadow 200ms',
  _hover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
});

const transitionGridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 'kdaFoundationMd',
});

const transitionBoxStyles = css({
  background: '#f8f9fa',
  border: '2px solid #dee2e6',
  borderRadius: 'kdaFoundationRadiusMd',
  padding: 'kdaFoundationMd',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 'kdaFoundationXs',
  '& span': {
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  '& code': {
    fontSize: '0.625rem',
    color: '#6c757d',
    wordBreak: 'break-all',
  },
});

const transitionBoxHoveredStyles = css({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderColor: 'transparent',
  color: 'white',
  transform: 'scale(1.02)',
  '& code': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

// ============================================================================
// Demo Components
// ============================================================================

function SpacingDemo() {
  const spacings = [
    { name: 'no', token: 'kdaFoundationNo' },
    { name: 'xxs', token: 'kdaFoundationXxs' },
    { name: 'xs', token: 'kdaFoundationXs' },
    { name: 'sm', token: 'kdaFoundationSm' },
    { name: 'md', token: 'kdaFoundationMd' },
    { name: 'lg', token: 'kdaFoundationLg' },
    { name: 'xl', token: 'kdaFoundationXl' },
    { name: 'xxl', token: 'kdaFoundationXxl' },
    { name: 'xxxl', token: 'kdaFoundationXxxl' },
  ];

  const sizeMap: Record<string, string> = {
    kdaFoundationNo: '0px',
    kdaFoundationXxs: '0.125rem',
    kdaFoundationXs: '0.25rem',
    kdaFoundationSm: '0.5rem',
    kdaFoundationMd: '1rem',
    kdaFoundationLg: '1.5rem',
    kdaFoundationXl: '1.75rem',
    kdaFoundationXxl: '2.25rem',
    kdaFoundationXxxl: '2.5rem',
  };

  return (
    <section className={sectionStyles}>
      <h2 className={sectionTitleStyles}>Spacing Tokens</h2>
      <p className={descriptionStyles}>
        Using <code>spacing.kdaFoundation*</code> for consistent spacing
      </p>
      <div className={spacingGridStyles}>
        {spacings.map((s) => (
          <div key={s.name} className={spacingItemStyles}>
            <div
              className={spacingBoxStyles}
              style={{ width: sizeMap[s.token], height: sizeMap[s.token] }}
            />
            <span className={tokenNameStyles}>{s.name}</span>
            <code className={tokenVarStyles}>{s.token}</code>
          </div>
        ))}
      </div>

      <h3 className={sectionSubtitleStyles}>Spacing in Action</h3>
      <div className={spacingExampleStyles}>
        <div className={cardStyles} style={{ padding: '1rem' }}>
          <p>Padding: <code>kdaFoundationMd</code></p>
        </div>
        <div className={cardStyles} style={{ padding: '1.5rem' }}>
          <p>Padding: <code>kdaFoundationLg</code></p>
        </div>
        <div className={cardStyles} style={{ padding: '1.75rem' }}>
          <p>Padding: <code>kdaFoundationXl</code></p>
        </div>
      </div>
    </section>
  );
}

function SizingDemo() {
  const sizes = [
    { name: 'n4', token: 'kdaFoundationSizeN4', value: '1rem' },
    { name: 'n6', token: 'kdaFoundationSizeN6', value: '1.5rem' },
    { name: 'n8', token: 'kdaFoundationSizeN8', value: '2rem' },
    { name: 'n10', token: 'kdaFoundationSizeN10', value: '2.5rem' },
    { name: 'n12', token: 'kdaFoundationSizeN12', value: '3rem' },
    { name: 'n16', token: 'kdaFoundationSizeN16', value: '4rem' },
    { name: 'n20', token: 'kdaFoundationSizeN20', value: '5rem' },
  ];

  return (
    <section className={sectionStyles}>
      <h2 className={sectionTitleStyles}>Size Tokens</h2>
      <p className={descriptionStyles}>
        Using <code>sizes.kdaFoundationSize*</code> for consistent sizing
      </p>
      <div className={sizeGridStyles}>
        {sizes.map((s) => (
          <div key={s.name} className={sizeItemStyles}>
            <div
              className={sizeBoxStyles}
              style={{ width: s.value, height: s.value }}
            />
            <span className={tokenNameStyles}>{s.name}</span>
          </div>
        ))}
      </div>

      <h3 className={sectionSubtitleStyles}>Icon Sizes</h3>
      <div className={iconSizesStyles}>
        <div className={iconDemoStyles} style={{ width: '1rem', height: '1rem' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className={iconDemoStyles} style={{ width: '1.5rem', height: '1.5rem' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className={iconDemoStyles} style={{ width: '2rem', height: '2rem' }}>
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
    { name: 'no', token: 'kdaFoundationRadiusNo', value: '0px' },
    { name: 'xs', token: 'kdaFoundationRadiusXs', value: '2px' },
    { name: 'sm', token: 'kdaFoundationRadiusSm', value: '4px' },
    { name: 'md', token: 'kdaFoundationRadiusMd', value: '6px' },
    { name: 'lg', token: 'kdaFoundationRadiusLg', value: '8px' },
    { name: 'xl', token: 'kdaFoundationRadiusXl', value: '16px' },
    { name: 'xxl', token: 'kdaFoundationRadiusXxl', value: '24px' },
    { name: 'round', token: 'kdaFoundationRadiusRound', value: '999rem' },
  ];

  return (
    <section className={sectionStyles}>
      <h2 className={sectionTitleStyles}>Border Radius Tokens</h2>
      <p className={descriptionStyles}>
        Using <code>radii.kdaFoundationRadius*</code> for consistent corners
      </p>
      <div className={radiusGridStyles}>
        {radii.map((r) => (
          <div key={r.name} className={radiusItemStyles}>
            <div
              className={radiusBoxStyles}
              style={{ borderRadius: r.value }}
            />
            <span className={tokenNameStyles}>{r.name}</span>
          </div>
        ))}
      </div>

      <h3 className={sectionSubtitleStyles}>Button Styles</h3>
      <div className={buttonDemoStyles}>
        <button className={btnStyles} style={{ borderRadius: '4px' }}>
          Small Radius
        </button>
        <button className={btnStyles} style={{ borderRadius: '6px' }}>
          Medium Radius
        </button>
        <button className={btnStyles} style={{ borderRadius: '999rem' }}>
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
      token: 'kdaFoundationTransitionDurationBase',
      duration: '400ms',
    },
    {
      id: 'd200',
      name: 'Fast (200ms)',
      token: 'kdaFoundationTransitionDurationD200',
      duration: '200ms',
    },
  ];

  return (
    <section className={sectionStyles}>
      <h2 className={sectionTitleStyles}>Transition Tokens</h2>
      <p className={descriptionStyles}>
        Using <code>durations.kdaFoundationTransition*</code> for animations
      </p>

      <div className={transitionGridStyles}>
        {transitions.map((t) => (
          <div
            key={t.id}
            className={`${transitionBoxStyles} ${hovered === t.id ? transitionBoxHoveredStyles : ''}`}
            style={{ transition: `all ${t.duration}` }}
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
    <div className={appStyles}>
      <header className={headerStyles}>
        <h1 className={titleStyles}>Panda CSS Plugin Example</h1>
        <p className={subtitleStyles}>Design tokens as Panda CSS preset</p>
      </header>

      <nav className={tabsStyles}>
        <button
          className={`${tabStyles} ${activeTab === 'spacing' ? tabActiveStyles : ''}`}
          onClick={() => setActiveTab('spacing')}
        >
          Spacing
        </button>
        <button
          className={`${tabStyles} ${activeTab === 'sizing' ? tabActiveStyles : ''}`}
          onClick={() => setActiveTab('sizing')}
        >
          Sizing
        </button>
        <button
          className={`${tabStyles} ${activeTab === 'radius' ? tabActiveStyles : ''}`}
          onClick={() => setActiveTab('radius')}
        >
          Border Radius
        </button>
        <button
          className={`${tabStyles} ${activeTab === 'transitions' ? tabActiveStyles : ''}`}
          onClick={() => setActiveTab('transitions')}
        >
          Transitions
        </button>
      </nav>

      <main className={contentStyles}>
        {activeTab === 'spacing' && <SpacingDemo />}
        {activeTab === 'sizing' && <SizingDemo />}
        {activeTab === 'radius' && <RadiusDemo />}
        {activeTab === 'transitions' && <TransitionsDemo />}
      </main>

      <footer className={footerStyles}>
        <p>
          Tokens imported from <code>./tokens/preset.ts</code> via{' '}
          <code>designTokensPreset</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
