import { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("spacing");

  return (
    <div className="app">
      <header className="header">
        <h1>CSS Plugin Example</h1>
        <p className="subtitle">Design tokens as CSS custom properties</p>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === "spacing" ? "active" : ""}`}
          onClick={() => setActiveTab("spacing")}
        >
          Spacing
        </button>
        <button
          className={`tab ${activeTab === "sizing" ? "active" : ""}`}
          onClick={() => setActiveTab("sizing")}
        >
          Sizing
        </button>
        <button
          className={`tab ${activeTab === "radius" ? "active" : ""}`}
          onClick={() => setActiveTab("radius")}
        >
          Border Radius
        </button>
        <button
          className={`tab ${activeTab === "transitions" ? "active" : ""}`}
          onClick={() => setActiveTab("transitions")}
        >
          Transitions
        </button>
      </nav>

      <main className="content">
        {activeTab === "spacing" && <SpacingDemo />}
        {activeTab === "sizing" && <SizingDemo />}
        {activeTab === "radius" && <RadiusDemo />}
        {activeTab === "transitions" && <TransitionsDemo />}
      </main>

      <footer className="footer">
        <p>
          Tokens imported from <code>./tokens/light.css</code> and <code>./tokens/dark.css</code>
        </p>
      </footer>
    </div>
  );
}

function SpacingDemo() {
  const spacings = [
    { name: "no", var: "--kda-foundation-spacing-no" },
    { name: "xxs", var: "--kda-foundation-spacing-xxs" },
    { name: "xs", var: "--kda-foundation-spacing-xs" },
    { name: "sm", var: "--kda-foundation-spacing-sm" },
    { name: "md", var: "--kda-foundation-spacing-md" },
    { name: "lg", var: "--kda-foundation-spacing-lg" },
    { name: "xl", var: "--kda-foundation-spacing-xl" },
    { name: "xxl", var: "--kda-foundation-spacing-xxl" },
    { name: "xxxl", var: "--kda-foundation-spacing-xxxl" },
  ];

  return (
    <section className="demo-section">
      <h2>Spacing Tokens</h2>
      <p className="demo-description">
        Using <code>var(--kda-foundation-spacing-*)</code> for consistent spacing
      </p>
      <div className="spacing-grid">
        {spacings.map((s) => (
          <div key={s.name} className="spacing-item">
            <div
              className="spacing-box"
              style={{ width: `var(${s.var})`, height: `var(${s.var})` }}
            />
            <span className="token-name">{s.name}</span>
            <code className="token-var">{s.var}</code>
          </div>
        ))}
      </div>

      <h3>Spacing in Action</h3>
      <div className="spacing-example">
        <div className="card" style={{ padding: "var(--kda-foundation-spacing-md)" }}>
          <p>
            Padding: <code>--kda-foundation-spacing-md</code>
          </p>
        </div>
        <div className="card" style={{ padding: "var(--kda-foundation-spacing-lg)" }}>
          <p>
            Padding: <code>--kda-foundation-spacing-lg</code>
          </p>
        </div>
        <div className="card" style={{ padding: "var(--kda-foundation-spacing-xl)" }}>
          <p>
            Padding: <code>--kda-foundation-spacing-xl</code>
          </p>
        </div>
      </div>
    </section>
  );
}

function SizingDemo() {
  const sizes = [
    { name: "n4", var: "--kda-foundation-size-n4" },
    { name: "n6", var: "--kda-foundation-size-n6" },
    { name: "n8", var: "--kda-foundation-size-n8" },
    { name: "n10", var: "--kda-foundation-size-n10" },
    { name: "n12", var: "--kda-foundation-size-n12" },
    { name: "n16", var: "--kda-foundation-size-n16" },
    { name: "n20", var: "--kda-foundation-size-n20" },
  ];

  return (
    <section className="demo-section">
      <h2>Size Tokens</h2>
      <p className="demo-description">
        Using <code>var(--kda-foundation-size-*)</code> for consistent sizing
      </p>
      <div className="size-grid">
        {sizes.map((s) => (
          <div key={s.name} className="size-item">
            <div className="size-box" style={{ width: `var(${s.var})`, height: `var(${s.var})` }} />
            <span className="token-name">{s.name}</span>
          </div>
        ))}
      </div>

      <h3>Icon Sizes</h3>
      <div className="icon-sizes">
        <div
          className="icon-demo"
          style={{
            width: "var(--kda-foundation-size-n4)",
            height: "var(--kda-foundation-size-n4)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div
          className="icon-demo"
          style={{
            width: "var(--kda-foundation-size-n6)",
            height: "var(--kda-foundation-size-n6)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div
          className="icon-demo"
          style={{
            width: "var(--kda-foundation-size-n8)",
            height: "var(--kda-foundation-size-n8)",
          }}
        >
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
    { name: "no", var: "--kda-foundation-radius-no" },
    { name: "xs", var: "--kda-foundation-radius-xs" },
    { name: "sm", var: "--kda-foundation-radius-sm" },
    { name: "md", var: "--kda-foundation-radius-md" },
    { name: "lg", var: "--kda-foundation-radius-lg" },
    { name: "xl", var: "--kda-foundation-radius-xl" },
    { name: "xxl", var: "--kda-foundation-radius-xxl" },
    { name: "round", var: "--kda-foundation-radius-round" },
  ];

  return (
    <section className="demo-section">
      <h2>Border Radius Tokens</h2>
      <p className="demo-description">
        Using <code>var(--kda-foundation-radius-*)</code> for consistent corners
      </p>
      <div className="radius-grid">
        {radii.map((r) => (
          <div key={r.name} className="radius-item">
            <div className="radius-box" style={{ borderRadius: `var(${r.var})` }} />
            <span className="token-name">{r.name}</span>
          </div>
        ))}
      </div>

      <h3>Button Styles</h3>
      <div className="button-demo">
        <button className="btn" style={{ borderRadius: "var(--kda-foundation-radius-sm)" }}>
          Small Radius
        </button>
        <button className="btn" style={{ borderRadius: "var(--kda-foundation-radius-md)" }}>
          Medium Radius
        </button>
        <button className="btn" style={{ borderRadius: "var(--kda-foundation-radius-round)" }}>
          Round
        </button>
      </div>
    </section>
  );
}

function TransitionsDemo() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="demo-section">
      <h2>Transition Tokens</h2>
      <p className="demo-description">
        Using <code>var(--kda-foundation-transition-*)</code> for animations
      </p>

      <div className="transition-grid">
        <div
          className={`transition-box ${hovered === "base" ? "hovered" : ""}`}
          style={{ transition: `all var(--kda-foundation-transition-duration-base)` }}
          onMouseEnter={() => setHovered("base")}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Base (400ms)</span>
          <code>--kda-foundation-transition-duration-base</code>
        </div>

        <div
          className={`transition-box ${hovered === "d200" ? "hovered" : ""}`}
          style={{ transition: `all var(--kda-foundation-transition-duration-d200)` }}
          onMouseEnter={() => setHovered("d200")}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Fast (200ms)</span>
          <code>--kda-foundation-transition-duration-d200</code>
        </div>

        <div
          className={`transition-box ${hovered === "sine" ? "hovered" : ""}`}
          style={{ transition: `all var(--kda-foundation-transition-animation-ease-out-sine)` }}
          onMouseEnter={() => setHovered("sine")}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Ease Out Sine</span>
          <code>--kda-foundation-transition-animation-ease-out-sine</code>
        </div>

        <div
          className={`transition-box ${hovered === "cubic" ? "hovered" : ""}`}
          style={{ transition: `all var(--kda-foundation-transition-animation-ease-out-cubic)` }}
          onMouseEnter={() => setHovered("cubic")}
          onMouseLeave={() => setHovered(null)}
        >
          <span>Ease Out Cubic</span>
          <code>--kda-foundation-transition-animation-ease-out-cubic</code>
        </div>
      </div>
    </section>
  );
}

export default App;
