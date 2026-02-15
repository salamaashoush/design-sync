import { useState } from "react";

// ============================================================================
// Demo Components
// ============================================================================

function SpacingDemo() {
  const spacings = [
    { name: "no", class: "p-[--spacing-kda-foundation-no]" },
    { name: "xxs", class: "p-[--spacing-kda-foundation-xxs]" },
    { name: "xs", class: "p-[--spacing-kda-foundation-xs]" },
    { name: "sm", class: "p-[--spacing-kda-foundation-sm]" },
    { name: "md", class: "p-[--spacing-kda-foundation-md]" },
    { name: "lg", class: "p-[--spacing-kda-foundation-lg]" },
    { name: "xl", class: "p-[--spacing-kda-foundation-xl]" },
    { name: "xxl", class: "p-[--spacing-kda-foundation-xxl]" },
    { name: "xxxl", class: "p-[--spacing-kda-foundation-xxxl]" },
  ];

  return (
    <section className="bg-white rounded-[--radius-kda-foundation-lg] p-[--spacing-kda-foundation-lg] shadow-sm">
      <h2 className="text-lg font-semibold mb-[--spacing-kda-foundation-xs] text-gray-900">
        Spacing Tokens
      </h2>
      <p className="text-gray-600 mb-[--spacing-kda-foundation-lg] text-sm">
        Using{" "}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded-[--radius-kda-foundation-xs] text-xs">
          p-[--spacing-kda-foundation-*]
        </code>{" "}
        for consistent spacing
      </p>

      <div className="flex flex-wrap gap-[--spacing-kda-foundation-md]">
        {spacings.map((s) => (
          <div
            key={s.name}
            className="flex flex-col items-center gap-[--spacing-kda-foundation-xs]"
          >
            <div
              className={`${s.class} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[--radius-kda-foundation-xs] min-w-1 min-h-1`}
            />
            <span className="text-xs font-semibold">{s.name}</span>
            <code className="text-[10px] text-gray-500 max-w-24 truncate">{s.class}</code>
          </div>
        ))}
      </div>

      <h3 className="mt-[--spacing-kda-foundation-lg] mb-[--spacing-kda-foundation-md] text-gray-700 font-medium">
        Spacing in Action
      </h3>
      <div className="flex flex-wrap gap-[--spacing-kda-foundation-md]">
        <div className="p-[--spacing-kda-foundation-md] bg-gray-50 border border-gray-200 rounded-[--radius-kda-foundation-md] flex-1 min-w-36">
          <p className="text-xs m-0">
            Padding: <code className="text-[10px]">spacing-md</code>
          </p>
        </div>
        <div className="p-[--spacing-kda-foundation-lg] bg-gray-50 border border-gray-200 rounded-[--radius-kda-foundation-md] flex-1 min-w-36">
          <p className="text-xs m-0">
            Padding: <code className="text-[10px]">spacing-lg</code>
          </p>
        </div>
        <div className="p-[--spacing-kda-foundation-xl] bg-gray-50 border border-gray-200 rounded-[--radius-kda-foundation-md] flex-1 min-w-36">
          <p className="text-xs m-0">
            Padding: <code className="text-[10px]">spacing-xl</code>
          </p>
        </div>
      </div>
    </section>
  );
}

function SizingDemo() {
  const sizes = [
    { name: "n4", class: "size-[--spacing-kda-foundation-size-n4]" },
    { name: "n6", class: "size-[--spacing-kda-foundation-size-n6]" },
    { name: "n8", class: "size-[--spacing-kda-foundation-size-n8]" },
    { name: "n10", class: "size-[--spacing-kda-foundation-size-n10]" },
    { name: "n12", class: "size-[--spacing-kda-foundation-size-n12]" },
    { name: "n16", class: "size-[--spacing-kda-foundation-size-n16]" },
    { name: "n20", class: "size-[--spacing-kda-foundation-size-n20]" },
  ];

  return (
    <section className="bg-white rounded-[--radius-kda-foundation-lg] p-[--spacing-kda-foundation-lg] shadow-sm">
      <h2 className="text-lg font-semibold mb-[--spacing-kda-foundation-xs] text-gray-900">
        Size Tokens
      </h2>
      <p className="text-gray-600 mb-[--spacing-kda-foundation-lg] text-sm">
        Using{" "}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded-[--radius-kda-foundation-xs] text-xs">
          size-[--spacing-kda-foundation-size-*]
        </code>{" "}
        for consistent sizing
      </p>

      <div className="flex flex-wrap gap-[--spacing-kda-foundation-lg] items-end">
        {sizes.map((s) => (
          <div
            key={s.name}
            className="flex flex-col items-center gap-[--spacing-kda-foundation-xs]"
          >
            <div
              className={`${s.class} bg-gradient-to-br from-teal-500 to-green-400 rounded-[--radius-kda-foundation-sm]`}
            />
            <span className="text-xs font-semibold">{s.name}</span>
          </div>
        ))}
      </div>

      <h3 className="mt-[--spacing-kda-foundation-lg] mb-[--spacing-kda-foundation-md] text-gray-700 font-medium">
        Icon Sizes
      </h3>
      <div className="flex gap-[--spacing-kda-foundation-lg] items-center">
        <div className="size-[--spacing-kda-foundation-size-n4] text-indigo-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="size-[--spacing-kda-foundation-size-n6] text-indigo-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="size-[--spacing-kda-foundation-size-n8] text-indigo-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function RadiusDemo() {
  const radii = [
    { name: "no", class: "rounded-[--radius-kda-foundation-no]" },
    { name: "xs", class: "rounded-[--radius-kda-foundation-xs]" },
    { name: "sm", class: "rounded-[--radius-kda-foundation-sm]" },
    { name: "md", class: "rounded-[--radius-kda-foundation-md]" },
    { name: "lg", class: "rounded-[--radius-kda-foundation-lg]" },
    { name: "xl", class: "rounded-[--radius-kda-foundation-xl]" },
    { name: "xxl", class: "rounded-[--radius-kda-foundation-xxl]" },
    { name: "round", class: "rounded-[--radius-kda-foundation-round]" },
  ];

  return (
    <section className="bg-white rounded-[--radius-kda-foundation-lg] p-[--spacing-kda-foundation-lg] shadow-sm">
      <h2 className="text-lg font-semibold mb-[--spacing-kda-foundation-xs] text-gray-900">
        Border Radius Tokens
      </h2>
      <p className="text-gray-600 mb-[--spacing-kda-foundation-lg] text-sm">
        Using{" "}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded-[--radius-kda-foundation-xs] text-xs">
          rounded-[--radius-kda-foundation-*]
        </code>{" "}
        for consistent corners
      </p>

      <div className="flex flex-wrap gap-[--spacing-kda-foundation-lg]">
        {radii.map((r) => (
          <div
            key={r.name}
            className="flex flex-col items-center gap-[--spacing-kda-foundation-xs]"
          >
            <div className={`size-16 bg-gradient-to-br from-pink-400 to-rose-500 ${r.class}`} />
            <span className="text-xs font-semibold">{r.name}</span>
          </div>
        ))}
      </div>

      <h3 className="mt-[--spacing-kda-foundation-lg] mb-[--spacing-kda-foundation-md] text-gray-700 font-medium">
        Button Styles
      </h3>
      <div className="flex flex-wrap gap-[--spacing-kda-foundation-md]">
        <button className="px-[--spacing-kda-foundation-lg] py-[--spacing-kda-foundation-sm] bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-[--radius-kda-foundation-sm] border-none cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-[--duration-kda-foundation-transition-duration-d200]">
          Small Radius
        </button>
        <button className="px-[--spacing-kda-foundation-lg] py-[--spacing-kda-foundation-sm] bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-[--radius-kda-foundation-md] border-none cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-[--duration-kda-foundation-transition-duration-d200]">
          Medium Radius
        </button>
        <button className="px-[--spacing-kda-foundation-lg] py-[--spacing-kda-foundation-sm] bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-[--radius-kda-foundation-round] border-none cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-[--duration-kda-foundation-transition-duration-d200]">
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
      id: "base",
      name: "Base (400ms)",
      class: "duration-[--duration-kda-foundation-transition-duration-base]",
    },
    {
      id: "d200",
      name: "Fast (200ms)",
      class: "duration-[--duration-kda-foundation-transition-duration-d200]",
    },
  ];

  return (
    <section className="bg-white rounded-[--radius-kda-foundation-lg] p-[--spacing-kda-foundation-lg] shadow-sm">
      <h2 className="text-lg font-semibold mb-[--spacing-kda-foundation-xs] text-gray-900">
        Transition Tokens
      </h2>
      <p className="text-gray-600 mb-[--spacing-kda-foundation-lg] text-sm">
        Using{" "}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded-[--radius-kda-foundation-xs] text-xs">
          duration-[--duration-*]
        </code>{" "}
        for animations
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[--spacing-kda-foundation-md]">
        {transitions.map((t) => (
          <div
            key={t.id}
            className={`bg-gray-50 border-2 border-gray-200 rounded-[--radius-kda-foundation-md] p-[--spacing-kda-foundation-md] cursor-pointer flex flex-col gap-[--spacing-kda-foundation-xs] transition-all ${t.class} ${
              hovered === t.id
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-transparent text-white scale-[1.02]"
                : ""
            }`}
            onMouseEnter={() => setHovered(t.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="font-semibold text-sm">{t.name}</span>
            <code
              className={`text-[10px] break-all ${hovered === t.id ? "text-white/80" : "text-gray-500"}`}
            >
              {t.class}
            </code>
          </div>
        ))}
      </div>

      <h3 className="mt-[--spacing-kda-foundation-lg] mb-[--spacing-kda-foundation-md] text-gray-700 font-medium">
        Z-Index Demo
      </h3>
      <div className="relative h-32 bg-gray-100 rounded-[--radius-kda-foundation-md] overflow-hidden">
        <div className="absolute bottom-4 left-4 size-16 bg-red-400 rounded-[--radius-kda-foundation-sm] z-[--z-kda-foundation-z-index-default] flex items-center justify-center text-white text-xs font-medium">
          default
        </div>
        <div className="absolute bottom-8 left-12 size-16 bg-blue-400 rounded-[--radius-kda-foundation-sm] z-[--z-kda-foundation-z-index-surface] flex items-center justify-center text-white text-xs font-medium">
          surface
        </div>
        <div className="absolute bottom-12 left-20 size-16 bg-green-400 rounded-[--radius-kda-foundation-sm] z-[--z-kda-foundation-z-index-sticky] flex items-center justify-center text-white text-xs font-medium">
          sticky
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main App
// ============================================================================

function App() {
  const [activeTab, setActiveTab] = useState("spacing");

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-[--spacing-kda-foundation-xl] px-[--spacing-kda-foundation-lg] text-center">
        <h1 className="text-2xl font-bold m-0 mb-[--spacing-kda-foundation-xs]">
          Tailwind CSS v4 Plugin Example
        </h1>
        <p className="m-0 opacity-90">Design tokens as Tailwind @theme CSS variables</p>
      </header>

      <nav className="flex gap-[--spacing-kda-foundation-xs] p-[--spacing-kda-foundation-md] bg-white border-b border-gray-200 justify-center">
        {(["spacing", "sizing", "radius", "transitions"] as const).map((tab) => (
          <button
            key={tab}
            className={`px-[--spacing-kda-foundation-md] py-[--spacing-kda-foundation-sm] border-none text-sm cursor-pointer rounded-[--radius-kda-foundation-md] transition-all duration-[--duration-kda-foundation-transition-duration-d200] ${
              activeTab === tab
                ? "bg-indigo-500 text-white"
                : "bg-transparent text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="max-w-4xl mx-auto p-[--spacing-kda-foundation-lg]">
        {activeTab === "spacing" && <SpacingDemo />}
        {activeTab === "sizing" && <SizingDemo />}
        {activeTab === "radius" && <RadiusDemo />}
        {activeTab === "transitions" && <TransitionsDemo />}
      </main>

      <footer className="text-center p-[--spacing-kda-foundation-lg] text-gray-500 text-sm">
        <p>
          Tokens imported from{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded-[--radius-kda-foundation-xs]">
            ./tokens/theme.css
          </code>{" "}
          via{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded-[--radius-kda-foundation-xs]">
            @theme
          </code>
        </p>
      </footer>
    </div>
  );
}

export default App;
