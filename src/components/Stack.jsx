import { useRef } from "react";
import SectionHeader from "./SectionHeader.jsx";
import useSpotlight from "./useSpotlight.js";
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
          {stack.map((group) => (
            <article
              key={group.title}
              data-reveal
              className={`spotlight flex flex-col rounded-2xl border border-bone/[0.08] bg-ink-2/80 p-6 md:p-7 ${layout[group.size ?? "default"]}`}
            >
              <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
              <p className="mt-1.5 text-sm text-mute">{group.note}</p>
              <ul className="mt-6 flex flex-wrap gap-2 md:mt-auto md:pt-8">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-bone/10 bg-ink/60 px-3 py-1.5 font-mono text-xs text-bone/85"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
