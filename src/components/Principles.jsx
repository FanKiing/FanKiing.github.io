import { useRef } from "react";
import SectionHeader from "./SectionHeader.jsx";
import { gsap, useGSAP, MOTION_OK } from "../lib/gsap.js";
import { useContent } from "../store/hooks.js";

export default function Principles() {
  const { principles } = useContent();
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // On large screens the section pins and the cards slide sideways with the scroll.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const distance = () => Math.max(0, track.current.scrollWidth - window.innerWidth);
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${Math.max(1, distance())}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="principles"
      ref={root}
      className="relative overflow-hidden border-t border-bone/[0.06] py-28 md:py-40 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="wrap">
        <SectionHeader label="Principles" title="How I work">
          Four rules I bring to every codebase and every team.
        </SectionHeader>
      </div>

      <ol
        ref={track}
        className="mt-14 flex flex-col gap-4 px-5 sm:px-8 lg:mt-16 lg:w-max lg:flex-row lg:gap-5 lg:pl-[max(2rem,calc((100vw-1200px)/2+2rem))] lg:pr-[max(2rem,calc((100vw-1200px)/2+2rem))]"
      >
        {principles.map((item) => (
          <li
            key={item.tag}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-bone/[0.08] bg-ink-2 p-7 lg:h-[360px] lg:w-[480px] lg:p-9"
          >
            <span
              className="pointer-events-none absolute -right-6 -bottom-10 font-display text-[9rem] leading-none font-bold text-bone/[0.03] transition-colors duration-500 group-hover:text-crimson/10"
              aria-hidden="true"
            >
              {item.tag.charAt(0)}
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-crimson">{item.tag}</p>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight lg:mt-auto lg:text-3xl">{item.title}</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-mute">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
