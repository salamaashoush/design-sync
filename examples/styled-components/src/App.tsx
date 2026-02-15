import { useState } from 'react';
import styled, { css } from 'styled-components';

// ============================================================================
// Styled Components using Design Tokens
// ============================================================================

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  font-family: system-ui, -apple-system, sans-serif;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: var(--kda-foundation-spacing-xl) var(--kda-foundation-spacing-lg);
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 var(--kda-foundation-spacing-xs);
  font-size: 2rem;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
`;

const Tabs = styled.nav`
  display: flex;
  gap: var(--kda-foundation-spacing-xs);
  padding: var(--kda-foundation-spacing-md);
  background: white;
  border-bottom: 1px solid #e9ecef;
  justify-content: center;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: var(--kda-foundation-spacing-sm) var(--kda-foundation-spacing-md);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: #495057;
  border-radius: var(--kda-foundation-radius-md);
  transition: all var(--kda-foundation-transition-duration-d200);

  &:hover {
    background: #f1f3f4;
  }

  ${({ $active }) =>
    $active &&
    css`
      background: #667eea;
      color: white;

      &:hover {
        background: #5a6fd6;
      }
    `}
`;

const Content = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: var(--kda-foundation-spacing-lg);
`;

const DemoSection = styled.section`
  background: white;
  border-radius: var(--kda-foundation-radius-lg);
  padding: var(--kda-foundation-spacing-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 var(--kda-foundation-spacing-xs);
  color: #212529;
`;

const SectionSubtitle = styled.h3`
  margin: var(--kda-foundation-spacing-lg) 0 var(--kda-foundation-spacing-md);
  color: #495057;
  font-size: 1rem;
`;

const Description = styled.p`
  color: #6c757d;
  margin-bottom: var(--kda-foundation-spacing-lg);

  code {
    background: #f1f3f4;
    padding: 0.125rem 0.375rem;
    border-radius: var(--kda-foundation-radius-xs);
    font-size: 0.875em;
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: var(--kda-foundation-spacing-lg);
  color: #6c757d;
  font-size: 0.875rem;

  code {
    background: #f1f3f4;
    padding: 0.125rem 0.375rem;
    border-radius: var(--kda-foundation-radius-xs);
  }
`;

// Spacing Demo Components
const SpacingGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--kda-foundation-spacing-md);
`;

const SpacingItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kda-foundation-spacing-xs);
`;

const SpacingBox = styled.div<{ $size: string }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--kda-foundation-radius-xs);
  min-width: 4px;
  min-height: 4px;
  width: var(${({ $size }) => $size});
  height: var(${({ $size }) => $size});
`;

const TokenName = styled.span`
  font-weight: 600;
  font-size: 0.75rem;
`;

const TokenVar = styled.code`
  font-size: 0.625rem;
  color: #6c757d;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpacingExample = styled.div`
  display: flex;
  gap: var(--kda-foundation-spacing-md);
  flex-wrap: wrap;
`;

const Card = styled.div<{ $padding: string }>`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: var(--kda-foundation-radius-md);
  flex: 1;
  min-width: 150px;
  padding: var(${({ $padding }) => $padding});

  p {
    margin: 0;
    font-size: 0.75rem;
  }
`;

// Size Demo Components
const SizeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--kda-foundation-spacing-lg);
  align-items: flex-end;
`;

const SizeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kda-foundation-spacing-xs);
`;

const SizeBox = styled.div<{ $size: string }>`
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-radius: var(--kda-foundation-radius-sm);
  width: var(${({ $size }) => $size});
  height: var(${({ $size }) => $size});
`;

const IconSizes = styled.div`
  display: flex;
  gap: var(--kda-foundation-spacing-lg);
  align-items: center;
`;

const IconDemo = styled.div<{ $size: string }>`
  color: #667eea;
  width: var(${({ $size }) => $size});
  height: var(${({ $size }) => $size});

  svg {
    width: 100%;
    height: 100%;
  }
`;

// Radius Demo Components
const RadiusGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--kda-foundation-spacing-lg);
`;

const RadiusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kda-foundation-spacing-xs);
`;

const RadiusBox = styled.div<{ $radius: string }>`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: var(${({ $radius }) => $radius});
`;

const ButtonDemo = styled.div`
  display: flex;
  gap: var(--kda-foundation-spacing-md);
  flex-wrap: wrap;
`;

const Button = styled.button<{ $radius: string }>`
  padding: var(--kda-foundation-spacing-sm) var(--kda-foundation-spacing-lg);
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: var(${({ $radius }) => $radius});
  transition: transform var(--kda-foundation-transition-duration-d200),
    box-shadow var(--kda-foundation-transition-duration-d200);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

// Transition Demo Components
const TransitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--kda-foundation-spacing-md);
`;

const TransitionBox = styled.div<{ $transition: string; $hovered: boolean }>`
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: var(--kda-foundation-radius-md);
  padding: var(--kda-foundation-spacing-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--kda-foundation-spacing-xs);
  transition: all var(${({ $transition }) => $transition});

  span {
    font-weight: 600;
    font-size: 0.875rem;
  }

  code {
    font-size: 0.625rem;
    color: #6c757d;
    word-break: break-all;
  }

  ${({ $hovered }) =>
    $hovered &&
    css`
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
      transform: scale(1.02);

      code {
        color: rgba(255, 255, 255, 0.8);
      }
    `}
`;

// ============================================================================
// Demo Components
// ============================================================================

function SpacingDemo() {
  const spacings = [
    { name: 'no', var: '--kda-foundation-spacing-no' },
    { name: 'xxs', var: '--kda-foundation-spacing-xxs' },
    { name: 'xs', var: '--kda-foundation-spacing-xs' },
    { name: 'sm', var: '--kda-foundation-spacing-sm' },
    { name: 'md', var: '--kda-foundation-spacing-md' },
    { name: 'lg', var: '--kda-foundation-spacing-lg' },
    { name: 'xl', var: '--kda-foundation-spacing-xl' },
    { name: 'xxl', var: '--kda-foundation-spacing-xxl' },
    { name: 'xxxl', var: '--kda-foundation-spacing-xxxl' },
  ];

  return (
    <DemoSection>
      <SectionTitle>Spacing Tokens</SectionTitle>
      <Description>
        Using <code>var(--kda-foundation-spacing-*)</code> for consistent spacing
      </Description>
      <SpacingGrid>
        {spacings.map((s) => (
          <SpacingItem key={s.name}>
            <SpacingBox $size={s.var} />
            <TokenName>{s.name}</TokenName>
            <TokenVar>{s.var}</TokenVar>
          </SpacingItem>
        ))}
      </SpacingGrid>

      <SectionSubtitle>Spacing in Action</SectionSubtitle>
      <SpacingExample>
        <Card $padding="--kda-foundation-spacing-md">
          <p>Padding: <code>--kda-foundation-spacing-md</code></p>
        </Card>
        <Card $padding="--kda-foundation-spacing-lg">
          <p>Padding: <code>--kda-foundation-spacing-lg</code></p>
        </Card>
        <Card $padding="--kda-foundation-spacing-xl">
          <p>Padding: <code>--kda-foundation-spacing-xl</code></p>
        </Card>
      </SpacingExample>
    </DemoSection>
  );
}

function SizingDemo() {
  const sizes = [
    { name: 'n4', var: '--kda-foundation-size-n4' },
    { name: 'n6', var: '--kda-foundation-size-n6' },
    { name: 'n8', var: '--kda-foundation-size-n8' },
    { name: 'n10', var: '--kda-foundation-size-n10' },
    { name: 'n12', var: '--kda-foundation-size-n12' },
    { name: 'n16', var: '--kda-foundation-size-n16' },
    { name: 'n20', var: '--kda-foundation-size-n20' },
  ];

  return (
    <DemoSection>
      <SectionTitle>Size Tokens</SectionTitle>
      <Description>
        Using <code>var(--kda-foundation-size-*)</code> for consistent sizing
      </Description>
      <SizeGrid>
        {sizes.map((s) => (
          <SizeItem key={s.name}>
            <SizeBox $size={s.var} />
            <TokenName>{s.name}</TokenName>
          </SizeItem>
        ))}
      </SizeGrid>

      <SectionSubtitle>Icon Sizes</SectionSubtitle>
      <IconSizes>
        <IconDemo $size="--kda-foundation-size-n4">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </IconDemo>
        <IconDemo $size="--kda-foundation-size-n6">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </IconDemo>
        <IconDemo $size="--kda-foundation-size-n8">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </IconDemo>
      </IconSizes>
    </DemoSection>
  );
}

function RadiusDemo() {
  const radii = [
    { name: 'no', var: '--kda-foundation-radius-no' },
    { name: 'xs', var: '--kda-foundation-radius-xs' },
    { name: 'sm', var: '--kda-foundation-radius-sm' },
    { name: 'md', var: '--kda-foundation-radius-md' },
    { name: 'lg', var: '--kda-foundation-radius-lg' },
    { name: 'xl', var: '--kda-foundation-radius-xl' },
    { name: 'xxl', var: '--kda-foundation-radius-xxl' },
    { name: 'round', var: '--kda-foundation-radius-round' },
  ];

  return (
    <DemoSection>
      <SectionTitle>Border Radius Tokens</SectionTitle>
      <Description>
        Using <code>var(--kda-foundation-radius-*)</code> for consistent corners
      </Description>
      <RadiusGrid>
        {radii.map((r) => (
          <RadiusItem key={r.name}>
            <RadiusBox $radius={r.var} />
            <TokenName>{r.name}</TokenName>
          </RadiusItem>
        ))}
      </RadiusGrid>

      <SectionSubtitle>Button Styles</SectionSubtitle>
      <ButtonDemo>
        <Button $radius="--kda-foundation-radius-sm">Small Radius</Button>
        <Button $radius="--kda-foundation-radius-md">Medium Radius</Button>
        <Button $radius="--kda-foundation-radius-round">Round</Button>
      </ButtonDemo>
    </DemoSection>
  );
}

function TransitionsDemo() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <DemoSection>
      <SectionTitle>Transition Tokens</SectionTitle>
      <Description>
        Using <code>var(--kda-foundation-transition-*)</code> for animations
      </Description>

      <TransitionGrid>
        <TransitionBox
          $transition="--kda-foundation-transition-duration-base"
          $hovered={hovered === 'base'}
          onMouseEnter={() => setHovered('base')}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Base (400ms)</span>
          <code>--kda-foundation-transition-duration-base</code>
        </TransitionBox>

        <TransitionBox
          $transition="--kda-foundation-transition-duration-d200"
          $hovered={hovered === 'd200'}
          onMouseEnter={() => setHovered('d200')}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Fast (200ms)</span>
          <code>--kda-foundation-transition-duration-d200</code>
        </TransitionBox>

        <TransitionBox
          $transition="--kda-foundation-transition-animation-ease-out-sine"
          $hovered={hovered === 'sine'}
          onMouseEnter={() => setHovered('sine')}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Ease Out Sine</span>
          <code>--kda-foundation-transition-animation-ease-out-sine</code>
        </TransitionBox>

        <TransitionBox
          $transition="--kda-foundation-transition-animation-ease-out-cubic"
          $hovered={hovered === 'cubic'}
          onMouseEnter={() => setHovered('cubic')}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Ease Out Cubic</span>
          <code>--kda-foundation-transition-animation-ease-out-cubic</code>
        </TransitionBox>
      </TransitionGrid>
    </DemoSection>
  );
}

// ============================================================================
// Main App
// ============================================================================

function App() {
  const [activeTab, setActiveTab] = useState('spacing');

  return (
    <AppContainer>
      <Header>
        <Title>Styled Components Plugin Example</Title>
        <Subtitle>Design tokens as styled-components with CSS variables</Subtitle>
      </Header>

      <Tabs>
        <Tab $active={activeTab === 'spacing'} onClick={() => setActiveTab('spacing')}>
          Spacing
        </Tab>
        <Tab $active={activeTab === 'sizing'} onClick={() => setActiveTab('sizing')}>
          Sizing
        </Tab>
        <Tab $active={activeTab === 'radius'} onClick={() => setActiveTab('radius')}>
          Border Radius
        </Tab>
        <Tab $active={activeTab === 'transitions'} onClick={() => setActiveTab('transitions')}>
          Transitions
        </Tab>
      </Tabs>

      <Content>
        {activeTab === 'spacing' && <SpacingDemo />}
        {activeTab === 'sizing' && <SizingDemo />}
        {activeTab === 'radius' && <RadiusDemo />}
        {activeTab === 'transitions' && <TransitionsDemo />}
      </Content>

      <Footer>
        <p>
          Tokens imported from <code>./tokens/light.ts</code> via{' '}
          <code>GlobalThemeStyle</code>
        </p>
      </Footer>
    </AppContainer>
  );
}

export default App;
