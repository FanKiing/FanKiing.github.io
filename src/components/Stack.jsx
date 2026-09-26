import { useRef } from "react";
import SectionHeader from "./SectionHeader.jsx";
import useSpotlight from "./useSpotlight.js";
import Sigil, { HouseShield, houses } from "./Sigil.jsx";
import TechIcon from "./TechIcon.jsx";
import { useContent } from "../store/hooks.js";

// Bento placement per card size on medium and large screens.
const layout = {
  wide: "md:col-span-2 lg:col-span-4",
  tall: "md:row-span-2 lg:col-span-2",
  half: "lg:col-span-3",
  default: "lg:col-span-2",
};

export default function Stack() {
  const { stack } = useContent();
  const root = useRef(null);
  useSpotlight(root);

  return (
    <section id="stack" ref={root} className="relative border-t border-bone/[0.06] py-28 md:py-40">
      <div className="wrap">
        <SectionHeader label="Stack" title="The tools I reach for">
          Laravel on the server, React in the browser, and a short list of tools I trust for
          everything in between.
        </SectionHeader>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {stack.map((group) => {
            const house = houses[group.house];
            return (
              <article
                key={group.title}
                data-reveal
                className={`spotlight group relative flex flex-col overflow-hidden rounded-2xl border border-bone/[0.08] bg-ink-2/80 p-6 md:p-7 ${layout[group.size ?? "default"]}`}
              >
                {house && (
                  <Sigil
                    house={group.house}
                    className="pointer-events-none absolute -top-6 -right-6 size-36 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.14]"
                  />
                )}
                {house && (
                  <p className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: house.color }}>
                    <HouseShield house={group.house} className="h-7 w-6" />
                    <span>{house.name}</span>
                  </p>
                )}
                <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
                <p className="mt-1.5 text-sm text-mute">{group.note}</p>
                {house && <p className="mt-1 font-display text-xs tracking-[0.12em] text-bone/40">“{house.words}”</p>}
                <ul className="mt-6 flex flex-wrap gap-2 md:mt-auto md:pt-8">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 rounded-full border border-bone/10 bg-ink/60 py-1.5 pr-3 pl-2 font-mono text-xs text-bone/85"
                    >
                      <TechIcon name={skill} className="size-4" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
