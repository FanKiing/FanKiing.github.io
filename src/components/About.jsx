import { useRef } from "react";
import GithubCard from "./GithubCard.jsx";
import useSpotlight from "./useSpotlight.js";
import { gsap, SplitText, useGSAP, MOTION_OK } from "../lib/gsap.js";
import { useContent } from "../store/hooks.js";

export default function About() {
  const { about, profile } = useContent();
  const root = useRef(null);
  useSpotlight(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Words light up one by one as the statement scrolls through the viewport.
        const split = SplitText.create(".about-statement", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ".about-statement", start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );
        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="relative py-28 md:py-40">
      <div className="wrap">
        <p data-reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-crimson">
          <span className="size-1.5 rotate-45 bg-crimson" />
          About
        </p>
        <p className="about-statement mt-8 max-w-5xl text-[clamp(1.7rem,4vw,3.4rem)] font-medium leading-[1.18] tracking-tight">
          {about.statement}
        </p>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.facts.map((fact) => (
            <article
              key={fact.label}
              data-reveal
              className="spotlight rounded-2xl border border-bone/[0.08] bg-ink-2/80 p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{fact.label}</p>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{fact.value}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{fact.note}</p>
            </article>
          ))}
          <div data-reveal>
            <GithubCard username={profile.githubUser} className="h-full" />
          </div>
        </div>

        <p data-reveal className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mute">
          <span className="text-bone">Off the clock:</span>
          {about.interests.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="text-crimson">✦</span>}
              {item}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
