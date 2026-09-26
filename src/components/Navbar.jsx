import { useEffect, useState } from "react";
import { useContent } from "../store/hooks.js";

export default function Navbar() {
  const { nav, profile } = useContent();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-bone/[0.06] bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-crimson" aria-hidden="true" />
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-3" aria-label="Back to top">
          <span className="font-display text-sm font-bold tracking-[0.3em]">{profile.name.toUpperCase()}</span>
          <span className="hidden font-arabic text-lg leading-none text-crimson sm:inline" lang="ar">
            {profile.arabicName}
          </span>
        </a>
        <nav aria-label="Sections" className="flex items-center gap-1">
          {nav.slice(0, -1).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="hidden rounded-full px-4 py-2 text-sm text-mute transition-colors hover:text-bone md:inline-block"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 rounded-full border border-bone/15 px-4 py-2 text-sm transition-colors hover:border-crimson hover:bg-crimson"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
