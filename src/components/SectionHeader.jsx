// Small crimson label above a large heading. `data-reveal` hooks into the
// shared scroll reveal set up in App.
export default function SectionHeader({ label, title, children }) {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end md:gap-12">
      <div data-reveal>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-crimson">
          <span className="size-1.5 rotate-45 bg-crimson" />
          {label}
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">{title}</h2>
      </div>
      {children && (
        <p data-reveal className="max-w-md text-lg leading-relaxed text-mute md:justify-self-end">
          {children}
        </p>
      )}
    </div>
  );
}
