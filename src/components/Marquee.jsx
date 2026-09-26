import TechIcon from "./TechIcon.jsx";
import { useContent } from "../store/hooks.js";

// Endless row of technologies. The list is rendered twice and shifted by
// half its width, so the loop is seamless.
export default function Marquee() {
  const { marquee } = useContent();
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee-mask overflow-hidden border-y border-bone/[0.06] py-5" role="region" aria-label="Technologies">
      <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {items.map((item, i) => (
          <li
            key={i}
            aria-hidden={i >= marquee.length}
            className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.18em] text-mute"
          >
            <span className="flex items-center gap-3">
              <TechIcon name={item} className="size-5" />
              {item}
            </span>
            <span className="text-crimson">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
